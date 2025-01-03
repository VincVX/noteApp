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
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden h-full flex flex-col transition-all duration-200 hover:border-white/10 hover:bg-white/[0.03]">
      <div className="card-header h-[52px] px-5 border-b border-white/[0.05] flex justify-between items-center bg-transparent">
        <div className="text-sm font-medium text-white/90 flex items-center gap-2">
          <Music size={16} />
          Spotify
        </div>
      </div>
      <div className="p-5 flex-1 overflow-hidden">
        <iframe
          src={getEmbedUrl(spotifyUrl)}
          className="w-full h-[352px] border-0"
          title="Spotify music player"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </div>
  )
} 