import React, { createContext, useContext, useState, useEffect } from 'react'

interface SpotifyContextType {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
  accessToken: string | null
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined)

// You'll need to register your app at https://developer.spotify.com/dashboard
// and add http://localhost:5173/callback as a redirect URI
const CLIENT_ID = 'YOUR_CLIENT_ID' // Replace with your client ID
const REDIRECT_URI = 'http://localhost:5173/callback'
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
const SCOPES = ['streaming', 'user-read-email', 'user-read-private']

export function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    // Check if we're returning from Spotify auth
    const hash = window.location.hash
    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const token = params.get('access_token')
      if (token) {
        setAccessToken(token)
        localStorage.setItem('spotify_token', token)
        // Remove the hash from the URL
        window.location.hash = ''
      }
    }

    // Check if we have a token in localStorage
    const token = localStorage.getItem('spotify_token')
    if (token) {
      setAccessToken(token)
    }
  }, [])

  const login = () => {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'token',
      scope: SCOPES.join(' '),
    })
    window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`
  }

  const logout = () => {
    setAccessToken(null)
    localStorage.removeItem('spotify_token')
  }

  return (
    <SpotifyContext.Provider 
      value={{
        isAuthenticated: !!accessToken,
        login,
        logout,
        accessToken
      }}
    >
      {children}
    </SpotifyContext.Provider>
  )
}

export function useSpotify() {
  const context = useContext(SpotifyContext)
  if (context === undefined) {
    throw new Error('useSpotify must be used within a SpotifyProvider')
  }
  return context
} 