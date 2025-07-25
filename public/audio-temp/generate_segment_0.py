
import gtts
from gtts import gTTS
import os

text = "We\'ll reverse this linked list using an iterative approach.\""

tts = gTTS(text=text, lang='en', slow=False)
tts.save("C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp\\segment_0.mp3")
print("Segment 0 generated")
