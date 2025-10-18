
import gtts
from gtts import gTTS
import os

text = "We swap the elements pointed to by left and right.\""

tts = gTTS(text=text, lang='en', slow=False)
tts.save("C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp\\segment_4.mp3")
print("Segment 4 generated")
