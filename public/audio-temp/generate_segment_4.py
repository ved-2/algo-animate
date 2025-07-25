
import gtts
from gtts import gTTS
import os

text = "And return the indices of the number and its complement.\""

tts = gTTS(text=text, lang='en', slow=False)
tts.save("C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp\\segment_4.mp3")
print("Segment 4 generated")
