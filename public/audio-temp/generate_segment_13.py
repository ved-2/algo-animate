
import gtts
from gtts import gTTS
import os

text = "We have successfully reversed the array in-place.\""

tts = gTTS(text=text, lang='en', slow=False)
tts.save("C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp\\segment_13.mp3")
print("Segment 13 generated")
