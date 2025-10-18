
import gtts
from gtts import gTTS
import os

text = "Again, swap elements at `left` and `right`."

tts = gTTS(text=text, lang='en', slow=False)
tts.save("C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp\\segment_8.mp3")
print("Segment 8 generated")
