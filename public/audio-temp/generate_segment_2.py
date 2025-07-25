
import gtts
from gtts import gTTS
import os

text = "As we iterate, we\'ll redirect the `next` pointer of each node to the `prev` node, effectively reversing the list.\""

tts = gTTS(text=text, lang='en', slow=False)
tts.save("C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp\\segment_2.mp3")
print("Segment 2 generated")
