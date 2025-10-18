
import gtts
from gtts import gTTS
import os

text = "Populating it with elements."

tts = gTTS(text=text, lang='en', slow=False)
tts.save("C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp\\segment_2.mp3")
print("Segment 2 generated")
