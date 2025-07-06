import requests
import json

# Test the timed audio generation API
def test_timed_audio():
    # Sample manim script
    manim_script = """from manim import *

class AlgorithmDemo(Scene):
    def construct(self):
        # Create array visualization
        arr = [1, 2, 3, 4, 5]
        rectangles = []
        texts = []
        
        # Create rectangles for array elements
        for i, val in enumerate(arr):
            rect = Rectangle(width=1, height=1, color=BLUE)
            rect.move_to([i * 1.5 - 3, 0, 0])
            text = Text(str(val), font_size=24, color=WHITE)
            text.move_to(rect.get_center())
            rectangles.append(rect)
            texts.append(text)
            self.play(Create(rect), Write(text))
        
        self.wait(1)
        
        # Show algorithm title
        title = Text("Algorithm Demo", font_size=36, color=YELLOW)
        title.move_to([0, 2, 0])
        self.play(Write(title))
        self.wait(1)
        
        # Animate some algorithm steps
        for i in range(len(rectangles) // 2):
            # Highlight elements being processed
            self.play(
                rectangles[i].animate.set_color(RED),
                rectangles[-(i+1)].animate.set_color(RED)
            )
            self.wait(0.5)
            
            # Swap colors to show processing
            self.play(
                rectangles[i].animate.set_color(GREEN),
                rectangles[-(i+1)].animate.set_color(GREEN)
            )
            self.wait(0.5)
        
        # Show completion
        self.play(title.animate.set_color(GREEN))
        self.wait(1)"""

    # Test data
    test_data = {
        "manimScript": manim_script,
        "algorithm": "Array Reversal",
        "approach": "Two Pointer",
        "theory": "This algorithm uses two pointers to reverse an array efficiently."
    }

    try:
        # Make request to the API
        response = requests.post(
            "http://localhost:3000/api/generate-timed-audio",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {response.headers}")
        
        if response.status_code == 200:
            # Save the audio file
            with open("test_timed_audio.mp3", "wb") as f:
                f.write(response.content)
            print("✅ Timed audio generated successfully!")
            print("Audio saved as test_timed_audio.mp3")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    test_timed_audio() 