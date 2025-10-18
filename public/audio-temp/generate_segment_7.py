
import gtts
from gtts import gTTS
import os

text = "Repeat this process until all elements are copied in reverse order. The original array remains unchanged.\""

tts = gTTS(text=text, lang='en', slow=False)
tts.save("C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp\\segment_7.mp3")
print("Segment 7 generated")
