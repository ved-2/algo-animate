import React from 'react';

const TimedAudioInfo = ({ manimScript, audioURL, isAudioEnabled }) => {
  const analyzeScript = (script) => {
    if (!script) return null;
    
    const lines = script.split('\n');
    let totalDuration = 0;
    let segments = [];
    let currentTime = 0;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Track wait times
      if (trimmed.includes('self.wait(')) {
        const match = trimmed.match(/self\.wait\((\d+(?:\.\d+)?)\)/);
        if (match) {
          const waitTime = parseFloat(match[1]);
          currentTime += waitTime;
          totalDuration += waitTime;
        }
      }
      
      // Track animations
      if (trimmed.includes('self.play(')) {
        segments.push({
          time: currentTime,
          action: extractAction(trimmed)
        });
      }
    }
    
    return { totalDuration, segments };
  };
  
  const extractAction = (line) => {
    if (line.includes('Create(')) return 'Creating element';
    if (line.includes('Write(')) return 'Writing text';
    if (line.includes('Transform(')) return 'Transforming element';
    if (line.includes('set_color(')) return 'Changing color';
    if (line.includes('animate.')) return 'Animating element';
    return 'Performing action';
  };
  
  const analysis = analyzeScript(manimScript);
  
  if (!analysis) return null;
  
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h4 className="font-semibold text-blue-800 mb-2">🎵 Timed Audio Narration</h4>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Duration:</span>
          <span className="font-medium">{analysis.totalDuration.toFixed(1)}s</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Audio Segments:</span>
          <span className="font-medium">{analysis.segments.length}</span>
        </div>
        
        {audioURL && isAudioEnabled && (
          <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
            <span className="text-green-700 text-xs">✅ Audio synchronized with video timing</span>
          </div>
        )}
        
        {analysis.segments.length > 0 && (
          <div className="mt-3">
            <span className="text-gray-600 text-xs">Timeline Preview:</span>
            <div className="mt-1 space-y-1">
              {analysis.segments.slice(0, 3).map((segment, idx) => (
                <div key={idx} className="text-xs text-gray-500">
                  {segment.time.toFixed(1)}s: {segment.action}
                </div>
              ))}
              {analysis.segments.length > 3 && (
                <div className="text-xs text-gray-400">... and {analysis.segments.length - 3} more segments</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimedAudioInfo; 