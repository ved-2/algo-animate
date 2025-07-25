
import gtts
from gtts import gTTS
import os

text = "Achieving a time complexity of O(n).\""

tts = gTTS(text=text, lang='en', slow=False)
tts.save("C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp\\segment_5.mp3")
print("Segment 5 generated")
