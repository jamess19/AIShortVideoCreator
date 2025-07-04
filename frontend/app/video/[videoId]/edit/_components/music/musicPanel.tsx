// components/MusicTrackList.tsx
"use client"

import {useState, useEffect } from 'react'
import axios from 'axios'
import MusicTrack from './musicTrack';
import { useVideoContext } from '@/hooks/use-video-context';
import { v4 as uuidv4 } from "uuid"
import { GetMusicTracksApi } from '@/services/music_api';

interface MusicTrack {
    id: string;
    name: string;
    artist: string;
    musicUrl: string;
    publicId: string
  }
  
export default function MusicPanel() {
    const [tracks, setTracks] = useState<MusicTrack[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedTrack, setSelectedTrack] = useState<MusicTrack>()
    const { addMusicAttachment, attachments, videoData } = useVideoContext()

    useEffect(() => {
      const fetchMusicTrack = async () => {
        try {
          const response = await GetMusicTracksApi();
          if(response){
            setTracks(response);
          } 
        }
        catch (err) {
          setError(`Unexpected error: ${err}`);
        }
        finally {
          setLoading(false)
        }
      }
      fetchMusicTrack();
    }, [])

    if(loading) {
        return <div> Loading... </div>
    }

    if(error) {
        return <div>{error}</div>
    }
    const filteredTracks = tracks.filter((music) => 
      music.name.toLowerCase().includes(searchQuery) ||
      music.artist.toLowerCase().includes(searchQuery) )

    const handleAddTrack = () => {
      if(!selectedTrack || !videoData)
        return

      const track = tracks.find(t => t.publicId === selectedTrack.publicId)
      if(!track)
        return

      const effectiveStartTime = videoData.currentTime
      const effectiveEndTime = videoData.duration

      addMusicAttachment({
        id: uuidv4(),
        url: track.musicUrl,
        title: track.name,
        artist: track.artist,
        startTime: effectiveStartTime,
        endTime: effectiveEndTime,
        publicId: track.publicId
      })
  
  
    }
    return (
    <div className="space-y-3 mx-2">
      <div className="flex items-center gap-2 p-2 bg-white border rounded-md">
        <input
          type="text"
          placeholder="Search music..."
          className="flex-1 bg-transparent border-gray-300 outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div>
      {filteredTracks.map((song) => (
        <MusicTrack
          key={song.publicId}
          name={song.name}
          artist={song.artist}
          musicUrl={song.musicUrl}
          publicId={song.publicId}
        />
      ))}
      </div>
    </div>
  )
}
