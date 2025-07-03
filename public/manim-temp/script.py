from manim import *

class LinkedListNode(VGroup):
    def __init__(self, value, **kwargs):
        super().__init__(**kwargs)
        self.value = value
        self.rect = Rectangle(width=1.0, height=1.0)
        self.text = Text(str(value)).move_to(self.rect.get_center())
        self.add(self.rect, self.text)

class LinkedList(VGroup):
    def __init__(self, values, **kwargs):
        super().__init__(**kwargs)
        self.nodes = [LinkedListNode(value) for value in values]
        for i in range(len(self.nodes) - 1):
            arrow = Arrow(self.nodes[i].get_right(), self.nodes[i+1].get_left(), buff=0.1)
            self.add(self.nodes[i], arrow)
        self.add(self.nodes[-1])
        self.arrange(RIGHT, buff=0.5)

class AlgorithmDemo(Scene):
    def construct(self):
        # Create linked list
        values = [1, 2, 3, 4, 5]
        linked_list = LinkedList(values).to_edge(UP)
        self.play(Create(linked_list))

        # Create pointers
        prev_ptr_text = Text("prev = None").to_edge(LEFT)
        curr_ptr_text = Text("curr").next(prev_ptr_text, direction=DOWN)
        next_ptr_text = Text("next").next(curr_ptr_text, direction=DOWN)

        prev_ptr = Pointer(color=BLUE)
        curr_ptr = Pointer(color=GREEN)
        next_ptr = Pointer(color=RED)

        prev_ptr.move_to(linked_list.get_left() + 5*LEFT) # offscreen

        curr_ptr.move_to(linked_list.nodes[0].get_center() + DOWN)

        self.play(Write(prev_ptr_text))
        self.play(Write(curr_ptr_text))
        self.play(Create(curr_ptr))
        self.wait(0.5)

        # prev = None
        self.play(curr_ptr.animate.move_to(linked_list.nodes[0].get_center() + DOWN))
        self.wait(0.5)

        prev = None # initial values
        current = linked_list.nodes[0]

        for i in range(len(linked_list.nodes)):
            if i < len(linked_list.nodes)-1:
                next_node = linked_list.nodes[i+1]
            else:
                next_node = None


            if next_node:
                next_ptr.move_to(next_node.get_center() + DOWN)
                next_ptr_text.become(Text("next").next(curr_ptr_text, direction=DOWN))
                self.play(Write(next_ptr_text))
                self.play(Create(next_ptr))
                self.wait(0.5)
                next_node_save = next_node # save value

            original_arrow = None
            if i < len(linked_list.nodes)-1: # keep original arrow object
                original_arrow = linked_list[2*i+1]

            # reverse arrow
            if prev:
              new_arrow = Arrow(linked_list.nodes[i].get_center(), prev.get_center(), buff=0.1, color=YELLOW)
            else:
              new_arrow = VMobject() #NULL arrow

            if i < len(linked_list.nodes)-1:
                self.play(Transform(linked_list[2*i+1], new_arrow))
            else:
                pass
            self.wait(0.5)

            # move prev
            prev_ptr.move_to(linked_list.nodes[i].get_center() + DOWN)
            prev_ptr_text.become(Text("prev").to_edge(LEFT))
            self.play(Transform(prev_ptr_text, prev_ptr_text))
            self.play(Transform(prev_ptr, prev_ptr))

            if next_node:
              curr_ptr.move_to(next_node.get_center() + DOWN)
              curr_ptr_text.become(Text("curr").next(prev_ptr_text, direction=DOWN))
              self.play(Transform(curr_ptr_text, curr_ptr_text))
              self.play(Transform(curr_ptr, curr_ptr))
              self.play(FadeOut(next_ptr))

            prev = linked_list.nodes[i]

            if next_node:
              current = next_node

            self.wait(1)

        # Clean up
        self.play(FadeOut(prev_ptr, curr_ptr, next_ptr, prev_ptr_text, curr_ptr_text, next_ptr_text))
        self.wait(1)

        # Reversed linked list
        self.play(linked_list.animate.arrange(RIGHT, buff=0.5))
        self.wait(2)