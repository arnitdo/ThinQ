// Individual Quiz Dash

/*
 * Graphs and stuff
 * No tabular option, graphs only
 * */
"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import Accordion from "./Accordion";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const attendance = [
  {
    attempted: 80,
    totalStudents: 90,
  },
];
const COLORS = ["#0088FE", "#00C49F"]; // Colors for attempted and total students

const score = [
  {
    name: "roshan",
    marks: 80,
  },
  {
    name: "roshan",
    marks: 43,
  },
  {
    name: "roshan",
    marks: 54,
  },
  {
    name: "roshan",
    marks: 65,
  },
  {
    name: "roshan",
    marks: 76,
  },
  {
    name: "roshan",
    marks: 87,
  },
  {
    name: "roshan",
    marks: 98,
  },
  {
    name: "roshan",
    marks: 89,
  },
  {
    name: "roshan",
    marks: 90,
  },
  {
    name: "roshan",
    marks: 100,
  },
];
const questions = [
  {
    id: 1,
    question: "What is the capital of India?",
    answer: "New Delhi",
  },
  {
    id: 2,
    question: "What is the capital of USA?",
    answer: "Washington DC",
  },
  {
    id: 3,
    question: "What is the capital of UK?",
    answer: "London",
  },
  {
    id: 4,
    question: "What is the capital of Australia?",
    answer: "Canberra",
  },
  {
    id: 5,
    question: "What is the capital of Japan?",
    answer: "Tokyo",
  }
  
]
const Page = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const isMobile = window.innerWidth < 768;
  const innerRadius = isMobile ? 30 : 100; // Adjust the inner radius based on mobile view
  const outerRadius = isMobile ? 60 : 140;
  return (
    <>
      <div className="text-zinc-700 font-medium text-4xl max-sm:text-2xl">
        Quiz Dashboard
      </div>
      <p className="mt-2 max-sm:text-xs">Operating System Quiz</p>
      <p className="max-sm:text-xs">Date Generated: 20/7/2024</p>
      <div className="flex max-[987px]:flex-col gap-4 my-4">
        <div className="bg-white border rounded-md shadow-lg p-4 w-6/12 max-[987px]:w-full h-96">
          <div className="text-black font-medium">Score Graph</div>
          <div className="w-full h-full py-4">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={score}>
                <CartesianGrid strokeDasharray="3 3" />

                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="marks"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white border rounded-md shadow-lg p-4 w-7/12 max-[987px]:w-full h-96">
          <div className="text-black font-medium">Overall Attendance</div>
          <div className="w-full h-full py-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  dataKey="value"
                  data={[
                    { name: "Attempted", value: attendance[0].attempted },
                    {
                      name: "Not Attempted",
                      value:
                        attendance[0].totalStudents - attendance[0].attempted,
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  fill="#8884d8"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                  paddingAngle={5}
                  startAngle={90}
                  endAngle={-270}
                >
                  {attendance.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="Questions p-4">
        <div className="text-zinc-700 font-medium text-4xl max-sm:text-2xl mt-4">
          Questions
        </div>
        
        {questions.map((q) => (
          <Accordion title={q.question} answer={q.answer} key={q.id} />
        ))}
        

      </div>
    </>
  );
};

export default Page;
