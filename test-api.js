const fetch = require('node-fetch');

async function testAPI() {
  const testScript = `from manim import *
class AlgorithmDemo(Scene):
    def construct(self):
        circle = Circle()
        self.play(Create(circle))
        self.wait(1)`;

  try {
    const response = await fetch('http://localhost:3000/api/render-manim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ script: testScript }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    } else {
      console.log('Success! Video generated.');
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

testAPI(); 