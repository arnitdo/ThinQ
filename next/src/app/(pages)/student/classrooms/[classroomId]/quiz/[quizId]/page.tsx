"use client"

import React, {useEffect, useState} from "react";
import QuizCard from "./(components)/QuizCard";
import Loader from "@/components/Loader";
import useAuthStore from "@/lib/zustand";
import { createQuizAttempt, getAllQuizzes, getLectures, getQuizData } from "@/util/client/helpers";
import { QuizAnalytics } from "@/util/api/api_responses";

export default function QuizPage({
  params,
}: {
  params: { classroomId: string, quizId: string };
}) {
  const {user} = useAuthStore()
	const [data, setData] = useState<QuizAnalytics| null>(null);

	useEffect(() => {
		const getData = async () => {
			if (!user) return;
			const quizzes = await getQuizData(user.userOrgId, params.quizId)
			if (quizzes) setData(quizzes)
		}
		getData()
	}, [user])
  const exampleQuiz = [
    {
      "questionText": "What is the first step in solving simultaneous equations by equating coefficients?",
      "questionOptions": [
        "Multiply both equations by the same number",
        "Subtract one equation from the other",
        "Add the two equations together",
        "Divide one equation by the other"
      ],
      "questionAnswerIndex": 0
    },
    {
      "questionText": "Which variable is typically eliminated first when solving simultaneous equations by equating coefficients?",
      "questionOptions": [
        "x",
        "y",
        "z",
        "w"
      ],
      "questionAnswerIndex": 0
    },
    {
      "questionText": "What is the next step after eliminating one variable when solving simultaneous equations by equating coefficients?",
      "questionOptions": [
        "Solve for the remaining variable",
        "Substitute the value of the eliminated variable back into one of the original equations",
        "Multiply both equations by the same number",
        "Subtract one equation from the other"
      ],
      "questionAnswerIndex": 1
    },
    {
      "questionText": "Which of the following is an example of a simultaneous equation?",
      "questionOptions": [
        "2x + 3y = 5",
        "x^2 + y^2 = 1",
        "sin(x) + cos(y) = 0",
        "e^x + ln(y) = 0"
      ],
      "questionAnswerIndex": 0
    },
    {
      "questionText": "What is the purpose of solving simultaneous equations?",
      "questionOptions": [
        "To find the values of the variables that satisfy both equations",
        "To eliminate one variable from a system of equations",
        "To simplify a system of equations",
        "To graph a system of equations"
      ],
      "questionAnswerIndex": 0
    }
  ]
  const [quizArray, setQuizArray] = useState<any>([])
  const [attemptId, setAttemptId] = useState<string>("")
  const [loading, setloading] = useState(true)
  const url = process.env.NEXT_PUBLIC_FLASK_URL

  useEffect(() => {
    if(!data)return
    setQuizArray(data.quizQuestions)
    if(!user) return
    const sendAttempt = async() => {
      const response = await createQuizAttempt(user.userOrgId,params.classroomId, params.quizId)
      if(!response) return
      setAttemptId(response)
      setloading(false)
    }
    sendAttempt()
  }, [data, user])
  
  

  // const getData = async() => {
  //   const res = await fetch(`/api/orgs/test/classroom/${params.classId}/rooms/${params.lectureId}/quiz`)
  //   const data = await res.json()
  //   if(data.responseStatus !== 'SUCCESS') useRouter().push(`/class/${params.classId}/`)
  //   const promises = data.quizes.map(async (quiz: any) => {
  //     const res2 = await fetch(`/api/orgs/test/classroom/${params.classId}/leacture/${params.lectureId}/quiz/${quiz.quizId}/attempt`,{
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({attemptTimestamp:Date.now()})
  //     } )
  //     const data2 = await res2.json()
  //     setAttemptId(data2.createdQuizAttemptId)
  //     const res = await fetch(`/api/orgs/test/classroom/${params.classId}/rooms/${params.lectureId}/quiz/${quiz.quizId}/question`);
  //     const quizData = await res.json();
  //     return quizData.quizQuestions;
  //   });
  //   const results = await Promise.all(promises);
  //   setQuizArray(results.flat())
  // }

  

  return loading?
  (<Loader/>):
  (
    <div className=" flex flex-col">
    <div className="min-h-[80vh] flex ">
      <div className=" w-full p-1">
        <div className="text-3xl font-semibold text-black max-sm:text-2xl">Multiple Choice Questions</div>
      <QuizCard
        QuizArray={quizArray}
        quizId={params.quizId}
        classId={params.classroomId}
        attemptId = {attemptId}
      />
      </div>
    </div>
    </div>
  );
}
