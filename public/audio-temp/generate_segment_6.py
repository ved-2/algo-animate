
import gtts
from gtts import gTTS
import os

text = "We swap the elements at the `left` and `right` indices."

tts = gTTS(text=text, lang='en', slow=False)
tts.save("C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp\\segment_6.mp3")
print("Segment 6 generated")
