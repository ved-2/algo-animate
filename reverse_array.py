from manim import *

class ReverseArrayAnimation(Scene):
    def construct(self):
        # Sample array
        arr = [1, 2, 3, 4, 5]
        n = len(arr)

        # Create rectangles for array elements with initial fill
        rects = [Rectangle(width=0.7, height=0.7).set_fill(WHITE, opacity=0) for _ in range(n)]
        for i, rect in enumerate(rects):
            rect.move_to(LEFT * (n / 2 - 0.5 - i) * 0.9)

        # Create text labels for elements
        texts = [Text(str(arr[i]), font_size=24).move_to(rects[i].get_center()) for i in range(n)]

        # Group and show initial array
        array_group = VGroup(*rects, *texts).move_to(UP * 2)
        self.play(Create(array_group))
        self.wait(1)

        # Create start and end pointers
        start_pointer = Arrow(start=DOWN, end=rects[0].get_center() + DOWN * 0.5, buff=0)
        end_pointer = Arrow(start=DOWN, end=rects[-1].get_center() + DOWN * 0.5, buff=0)
        start_label = Text("start", font_size=20).next_to(start_pointer, DOWN)
        end_label = Text("end", font_size=20).next_to(end_pointer, DOWN)

        self.play(Create(start_pointer), Create(end_pointer), Write(start_label), Write(end_label))
        self.wait(1)

        # Swap loop
        start = 0
        end = n - 1
        while start < end:
            # Highlight current elements
            self.play(
                rects[start].animate.set_fill(YELLOW, opacity=0.5),
                rects[end].animate.set_fill(YELLOW, opacity=0.5)
            )
            self.wait(0.3)

            # Swap backend values
            arr[start], arr[end] = arr[end], arr[start]

            # Create new Text objects
            new_text_start = Text(str(arr[start]), font_size=24).move_to(rects[start].get_center())
            new_text_end = Text(str(arr[end]), font_size=24).move_to(rects[end].get_center())

            # Animate value change
            self.play(
                Transform(texts[start], new_text_start),
                Transform(texts[end], new_text_end)
            )
            texts[start] = new_text_start
            texts[end] = new_text_end
            self.wait(0.3)

            # Remove highlights
            self.play(
                rects[start].animate.set_fill(WHITE, opacity=0),
                rects[end].animate.set_fill(WHITE, opacity=0)
            )

            # Move pointers if applicable
            start += 1
            end -= 1
            if start < end:
                self.play(
                    start_pointer.animate.move_to(rects[start].get_center() + DOWN * 0.5),
                    end_pointer.animate.move_to(rects[end].get_center() + DOWN * 0.5)
                )
                self.wait(0.3)

        # End animation
        self.play(FadeOut(start_pointer), FadeOut(end_pointer), FadeOut(start_label), FadeOut(end_label))
        self.wait(1)
