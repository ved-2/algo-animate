
import gtts
from gtts import gTTS
import os

text = "If the complement exists, we found our pair.\""

tts = gTTS(text=text, lang='en', slow=False)
tts.save("C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp\\segment_3.mp3")
print("Segment 3 generated")
