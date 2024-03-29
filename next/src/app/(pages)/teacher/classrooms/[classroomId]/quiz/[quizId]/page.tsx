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
import useAuthStore from "@/lib/zustand";
import { GetQuizDataResponse, QuizAnalytics } from "@/util/api/api_responses";
import { Lecture, QuizAttempt, QuizQuestion } from "@prisma/client";
import { getQuizData } from "@/util/client/helpers";
import Loader from "@/components/Loader";

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
const Page = ({params: {classroomId, quizId}}:{params: {classroomId:string, quizId: string}}) => {

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const {user} = useAuthStore()
	const [data, setData] = useState<QuizAnalytics | null>(null);

  const [attemptData, setAttemptData] = useState(null)

	useEffect(() => {
		const getData = async () => {
			if (!user) return;
			const quizzes = await getQuizData(user.userOrgId, quizId)
			if (!quizzes) return
      setData(quizzes)

		}
		getData()
	}, [user])

  if (!isClient) return null;

  const isMobile = window.innerWidth < 768;
  const innerRadius = isMobile ? 30 : 100; // Adjust the inner radius based on mobile view
  const outerRadius = isMobile ? 60 : 140;

  function getScore(quizAttempts: { attemptTimestamp: Date; attemptUser: { userDisplayName: string; userId: string; }; attemptResponses: { responseId: string; attemptId: string; questionId: string; responseContent: string; responseAccuracy: number; }[]; }[]): any[] | undefined {
    if(!quizAttempts) return score
    let temp: {name:string, marks:number}[] = []
    quizAttempts.forEach(attempt => {
      let marks = 0
      attempt.attemptResponses.forEach(response => {
        marks += response.responseAccuracy
      })
      temp.push({name: attempt.attemptUser.userDisplayName, marks: marks*20})
    })
    return temp
  }

  // {
  //   id: 1,
  //   question: "What is the capital of India?",
  //   answer: "New Delhi",
  // },

  return !data?
  (<Loader/>):
  (
    <>
      <div className="text-zinc-700 font-medium text-4xl max-sm:text-2xl">
        Quiz Dashboard
      </div>
      <p className="mt-2 max-sm:text-xs">{data.quizName}</p>
      <p className="max-sm:text-xs">Unique ID: {data.quizId}</p>
      <div className="flex max-[987px]:flex-col gap-4 my-4">
        <div className="bg-white border rounded-md shadow-lg p-4 w-6/12 max-[987px]:w-full h-96">
          <div className="text-black font-medium">Score Graph</div>
          <div className="w-full h-full py-4">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={getScore(data.quizAttempts)}>
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
                    { name: "Attempted", value: data?data._count.quizAttempts:0 },
                    {
                      name: "Not Attempted",
                      value:
                        data?(data.quizLecture._count.lectureAttendance+10 - data._count.quizAttempts):0,
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
        
        {(data.quizQuestions.map((item, ind)=>{return {id:ind+1, question:item.questionText, answer:item.questionOptions[item.questionAnswerIndex]}})).map((q) => (
          <Accordion title={q.question} answer={q.answer} key={q.id} />
        ))}
        

      </div>
    </>
  );
};

export default Page;
