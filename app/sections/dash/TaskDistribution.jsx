"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#34D399", "#FBBF24", "#60A5FA", "#F87171"];

const TaskDistribution = ({ stats }) => {
  const data = [
    { name: "Completed", value: stats.completed },
    { name: "Pending", value: stats.pending },
    { name: "To-Do Today", value: stats.today },
    { name: "Total", value: stats.total },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskDistribution;
