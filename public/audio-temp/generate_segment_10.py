
import gtts
from gtts import gTTS
import os

text = "One final swap."

tts = gTTS(text=text, lang='en', slow=False)
tts.save("C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp\\segment_10.mp3")
print("Segment 10 generated")
