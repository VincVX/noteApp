import React, { useState } from 'react'
import { Music } from 'lucide-react'
import { useSpotify } from '../../contexts/SpotifyContext'

interface SpotifyWidgetProps {
  onDelete: () => void
}

export function SpotifyWidget({ onDelete }: SpotifyWidgetProps) {
  const { isAuthenticated } = useSpotify()
  const [spotifyUrl] = useState('https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M') // Default playlist

  const getEmbedUrl = (url: string) => {
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
      </div>
      <div className="card-content">
        <iframe
          src={getEmbedUrl(spotifyUrl)}
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </div>
  )
} 