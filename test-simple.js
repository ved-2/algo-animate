const fetch = require('node-fetch');

async function testSimpleAPI() {
  const simpleScript = `from manim import *
class AlgorithmDemo(Scene):
    def construct(self):
        # Create a simple circle
        circle = Circle(color=BLUE)
        self.play(Create(circle))
        self.wait(1)
        
        # Add some text
        text = Text("Hello", font_size=36)
        text.next_to(circle, UP)
        self.play(Write(text))
        self.wait(1)`;

  try {
    console.log('Testing API with simple script...');
    const response = await fetch('http://localhost:3000/api/render-manim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ script: simpleScript }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    } else {
      const blob = await response.blob();
      console.log('Success! Video size:', blob.size, 'bytes');
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

testSimpleAPI(); 