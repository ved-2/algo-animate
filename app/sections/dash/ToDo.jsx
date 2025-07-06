"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarSearch, PlusCircle, Trash2 } from "lucide-react";

const ToDo = ({ onTaskUpdate }) => {
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const total = tasks.length;
    const completed = 0; 
    const today = tasks.filter(
      (item) => item.date === new Date().toISOString().split("T")[0]
    ).length;
    const pending = total - completed;

    onTaskUpdate({ total, pending, completed, today });
  }, [tasks, onTaskUpdate]);

  const handleAddTask = () => {
    if (task.trim() !== "" && date !== "") {
      setTasks([...tasks, { text: task, date }]);
      setTask("");
      setDate("");
    }
  };

  const handleDeleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  return (
    <div className="px-4 bg-white space-y-4 overflow-hidden rounded-2xl h-full flex flex-col">
      <h2 className="text-lg font-semibold ">My To-Do List</h2>

      <div className="flex flex-col md:flex-row gap-3">
        <Input
          type="text"
          placeholder="Enter Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="flex-1"
        />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAddTask} className="flex items-center gap-2">
          <PlusCircle size={18} />
          Save
        </Button>
      </div>

      <div className="overflow-y-auto pr-2 space-y-3 flex-1">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No tasks added yet.</p>
        ) : (
          tasks.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-[#f9fafb] rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div>
                <p className="font-medium text-base">{item.text}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <CalendarSearch size={12} />
                  {new Date(item.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteTask(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ToDo;
