
import gtts
from gtts import gTTS
import os

text = "And move the pointers."

tts = gTTS(text=text, lang='en', slow=False)
tts.save("C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp\\segment_9.mp3")
print("Segment 9 generated")
