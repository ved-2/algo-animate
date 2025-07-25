
import gtts
from gtts import gTTS
import os

text = "We\'ll be using three pointers: `prev`, `current`, and `next`.\""

tts = gTTS(text=text, lang='en', slow=False)
tts.save("C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp\\segment_1.mp3")
print("Segment 1 generated")
