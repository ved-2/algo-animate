
import subprocess
import os

input_files = ["C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp\\segment_0.mp3","C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp\\segment_1.mp3"]
output_file = "C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp\\final-narration.mp3"

# Create file list for ffmpeg
with open("C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp/filelist.txt", "w") as f:
    for file in input_files:
        f.write(f"file '{file}'\n")

# Concatenate using ffmpeg
subprocess.run([
    "ffmpeg", "-f", "concat", "-safe", "0", 
    "-i", "C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp/filelist.txt", 
    "-c", "copy", output_file
])
print("Audio concatenated successfully")
