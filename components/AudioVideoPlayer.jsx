import React, { useRef, useEffect, useState } from 'react';

const AudioVideoPlayer = ({ videoSrc, audioSrc, className = "" }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (!video || !audio) return;

    // Sync audio with video
    const handleVideoPlay = () => {
      audio.currentTime = video.currentTime;
      audio.play();
      setIsPlaying(true);
    };

    const handleVideoPause = () => {
      audio.pause();
      setIsPlaying(false);
    };

    const handleVideoSeek = () => {
      audio.currentTime = video.currentTime;
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    // Add event listeners
    video.addEventListener('play', handleVideoPlay);
    video.addEventListener('pause', handleVideoPause);
    video.addEventListener('seeked', handleVideoSeek);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('play', handleVideoPlay);
      video.removeEventListener('pause', handleVideoPause);
      video.removeEventListener('seeked', handleVideoSeek);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoSrc, audioSrc]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`audio-video-player ${className}`}>
      {/* Video Player */}
      <video
        ref={videoRef}
        src={videoSrc}
        controls
        preload="metadata"
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        style={{
          width: '100%',
          borderRadius: '12px',
          maxWidth: '100%',
          height: 'auto'
        }}
        playsInline
      />
      
      {/* Audio Player (hidden but synced) */}
      <audio
        ref={audioRef}
        src={audioSrc}
        style={{ display: 'none' }}
      />
      
      {/* Custom Controls */}
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
        <span>{formatTime(currentTime)}</span>
        <div className="flex-1 bg-gray-200 rounded-full h-1">
          <div 
            className="bg-blue-500 h-1 rounded-full"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
        <span>{formatTime(duration)}</span>
        {audioSrc && (
          <span className="text-green-600">🎵 Audio</span>
        )}
      </div>
    </div>
  );
};

export default AudioVideoPlayer; 