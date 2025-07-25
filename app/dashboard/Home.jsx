"use client";

import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import ToDo from "../sections/dash/ToDo";
import TaskDistribution from "../sections/dash/TaskDistribution";

const Top = () => {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    today: 0,
  });

  if (!isLoaded) return <div>Loading...</div>;

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const username =
    user.username || user.firstName || user.emailAddresses[0].emailAddress;

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Greeting + Date + Task Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-md h-[180px] max-w-full">
        <h2 className="text-2xl font-semibold mb-1">Hi, {username}!!</h2>
        <p className="text-sm text-gray-500">{today}</p>
        <div className="flex justify-between gap-2 mt-8 text-center text-sm text-gray-700">
          <div>
            <p className="font-medium">Total Tasks</p>
            <p className="text-gray-400">{stats.total}</p>
          </div>
          <div>
            <p className="font-medium">Pending</p>
            <p className="text-gray-400">{stats.pending}</p>
          </div>
          <div>
            <p className="font-medium">ToDo Today</p>
            <p className="text-gray-400">{stats.today}</p>
          </div>
          <div>
            <p className="font-medium">Completed</p>
            <p className="text-gray-400">{stats.completed}</p>
          </div>
        </div>
      </div>

      {/* Task Distribution & Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md h-[450px]">
          <h3 className="text-lg font-medium mb-2">Task Distribution</h3>
          <TaskDistribution stats={stats} />
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-md h-[450px]">
          <ToDo onTaskUpdate={setStats} />
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white p-6 rounded-2xl shadow-md min-h-[200px] mt-6">
        <h3 className="text-lg font-medium mb-2">Recent Tasks</h3>
        {/* Placeholder for recent tasks */}
      </div>
    </div>
  );
};

export default Top;
