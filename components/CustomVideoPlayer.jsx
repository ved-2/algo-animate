import React from "react";

const CustomVideoPlayer = ({ src, className }) => {
  return (
    <div className={`video-container ${className}`}>
      <video 
        src={src} 
        controls 
        autoPlay={false} 
        playsInline 
        preload="metadata"
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        style={{ 
          width: '100%', 
          borderRadius: '12px',
          maxWidth: '100%',
          height: 'auto'
        }}
      />
    </div>
  );
};

export default CustomVideoPlayer;
