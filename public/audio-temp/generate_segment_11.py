
import gtts
from gtts import gTTS
import os

text = "Until `left` is no longer less than `right`."

tts = gTTS(text=text, lang='en', slow=False)
tts.save("C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp\\segment_11.mp3")
print("Segment 11 generated")
