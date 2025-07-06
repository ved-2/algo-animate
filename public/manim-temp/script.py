from manim import *
class AlgorithmDemo(Scene):
    def construct(self):
        # Create a simple animation
        circle = Circle(color=BLUE)
        self.play(Create(circle))
        self.wait(1)
        
        # Add some text with explicit font size
        text = Text("Algorithm Demo", font_size=36, color=WHITE)
        text.next_to(circle, UP)
        self.play(Write(text))
        self.wait(1)
        
        # Show the result
        square = Square(color=RED)
        square.next_to(circle, DOWN)
        self.play(Create(square))
        self.wait(1)