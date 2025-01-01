import React, { useState } from 'react'
import { Music, LogIn, LogOut } from 'lucide-react'
import { useSpotify } from '../../contexts/SpotifyContext'

interface SpotifyWidgetProps {
  onDelete?: () => void
}

export const SpotifyWidget: React.FC<SpotifyWidgetProps> = () => {
  const [spotifyUrl, setSpotifyUrl] = useState('')
  const [isEditing, setIsEditing] = useState(true)
  const { isAuthenticated, login, logout } = useSpotify()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
  }

  const getEmbedUrl = (url: string) => {
    // Convert spotify URLs to embed URLs
    const spotifyRegex = /spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/
    const match = url.match(spotifyRegex)
    if (match) {
      const [, type, id] = match
      return `https://open.spotify.com/embed/${type}/${id}${isAuthenticated ? '?utm_source=generator&theme=0' : ''}`
    }
    return url
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Music size={16} />
          Spotify
        </div>
        <button 
          onClick={isAuthenticated ? logout : login}
          className="spotify-auth-btn"
          title={isAuthenticated ? "Logout from Spotify" : "Login to Spotify"}
        >
          {isAuthenticated ? <LogOut size={16} /> : <LogIn size={16} />}
        </button>
      </div>
      <div className="card-content">
        {!isAuthenticated && (
          <div className="spotify-login-prompt">
            <p>Login to Spotify to listen to full songs</p>
            <button onClick={login} className="spotify-login-btn">
              <LogIn size={16} />
              Login with Spotify
            </button>
          </div>
        )}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="spotify-form">
            <input
              type="text"
              value={spotifyUrl}
              onChange={(e) => setSpotifyUrl(e.target.value)}
              placeholder="Paste Spotify URL (track, album, playlist, or artist)"
              className="spotify-input"
            />
            <button type="submit" className="spotify-submit">
              Embed
            </button>
          </form>
        ) : (
          <div className="spotify-embed">
            <iframe
              src={getEmbedUrl(spotifyUrl)}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
            <button 
              onClick={() => setIsEditing(true)} 
              className="spotify-change-url"
            >
              Change URL
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 