
import gtts
from gtts import gTTS
import os

text = """(Upbeat intro music fades)

Hello everyone, and welcome! Today, we're going to visualize a simple string reversal algorithm. Our goal: reverse the words in a given string.

(Animation starts)

Here's our input string: "the sky is blue". We begin by splitting the string into individual words. Now we see each word as a separate element.

Next, we'll create a bounding box around each word, highlighting them individually.

Watch as we prepare to reverse the order of these words. At the top we can see the instruction that says "Reversing the words...".

We begin by swapping the first and last words. Notice how the bounding boxes for "the" and "blue" turn yellow, indicating they're being swapped.

Now, watch as "the" moves to the end, and "blue" comes to the beginning! Then, we swap the second and second-to-last words, "sky" and "is".

Again, the boxes turn yellow, and the words switch places.

Finally, we arrange the reversed words back into a string.

And there you have it! The reversed string: "blue is sky the". The brute force approach to reversing the words of the string. (Short outro music begins)"""

tts = gTTS(text=text, lang='en', slow=False)
tts.save("C:\\Users\\vedan\\OneDrive\\Desktop\\Web Dev\\algo-animate\\public\\audio-temp\\narration.mp3")
print("Audio generated successfully")
