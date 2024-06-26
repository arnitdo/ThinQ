"use client";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Volume2, VolumeX } from "lucide-react";
import { QuizQuestion } from "@prisma/client";
import { createQuizResponse } from "@/util/client/helpers";
import useAuthStore from "@/lib/zustand";

export default function QuizCard({
  QuizArray,
  quizId,
  classId,
  attemptId,
}: {
  QuizArray: QuizQuestion[];
  quizId: string;
  classId: string;
  attemptId: string;
}) {
  const { user } = useAuthStore()
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [coin, setcoin] = React.useState(0);
  let randomQuiz: QuizQuestion[] = useMemo(() => {
    const randArr: QuizQuestion[] = [];
    for (let i = 0; i < QuizArray.length; i++) {
      let random = Math.floor(Math.random() * QuizArray.length);
      randArr.push(QuizArray[random]);
    }
    return randArr
  }, []);
  const router = useRouter();

  useEffect(() => {
    if (!QuizArray[currentQuestion + 1]) {
      // redirect("/home")
      // alert("You have completed the quiz");
    }
  }, [currentQuestion]);

  const checker = (correctInd: number, option: string) => {
    return randomQuiz[currentQuestion].questionOptions[correctInd] === option;
  };
  // const saveRecord = async (questionId: string, correctAnswerInd: number, selectedAnswer: string, quizId: string) => {
  //   try {
  //     const res = await fetch(`/api/orgs/test/classroom/${classId}/rooms/${lectureId}/quiz/${quizId}/attempt/${attemptId}/response?questionId=${questionId}`,{
  //       method:"POST",
  //       headers:{
  //         "Content-type":"application/json"
  //       },
  //       body:JSON.stringify({responseContent:selectedAnswer, responseAccuracy:checker(correctAnswerInd, selectedAnswer)?1:0})
  //     } )
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  console.log(randomQuiz[currentQuestion]);
  const [correct, setCorrect] = React.useState<string[]>([]);
  const openRef = React.useRef<HTMLInputElement>(null);

  const HandleOption = async (option: string) => {
    if (!user) return
    if (checker(randomQuiz[currentQuestion].questionAnswerIndex, option)) {
      setCorrect([...correct, option]);
      toast.success(
        `Correct Answer +x 🪙`
      );
      // setcoin(coin+randomQuiz[currentQuestion].coins);
    } else {
      toast.error("Wrong Answer");
    }
    if (currentQuestion === randomQuiz.length - 1) {
      router.push(`/student/classrooms/${classId}/quiz`);
      return toast.success("You have completed the quiz 🎉");
    }
    setCurrentQuestion(currentQuestion + 1);
    const response = await createQuizResponse(user.userOrgId, classId, quizId, attemptId, randomQuiz[currentQuestion].questionId, checker(randomQuiz[currentQuestion].questionAnswerIndex, option) ? 1 : 0, "")
    if (!response) return
  };

  const [paused, setPaused] = useState(false);
  const textToAudio = () => {
    setPaused(!paused);
    const text =
      randomQuiz[currentQuestion].questionText.replaceAll(/_/g, "") +
      " " +
      randomQuiz[currentQuestion].questionOptions.join(", ");
    let msg = text;

    let speech = new SpeechSynthesisUtterance();
    speech.lang = `en-US`;

    speech.text = msg;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    if (paused) return window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
    // speechSynthesis.cancel();
  };

  return (
    randomQuiz[currentQuestion] && (
      <>
        <div className="">
          <h1
            className={`${coin > 0 ? "opacity-100" : "opacity-0"
              } transition-all font-bold text-xl text-center`}
          >
            {" "}
            Total coins earned : {coin}🪙
          </h1>
          <Card className=" w-full text-wrap p-2 bg-white hover:shadow-xl transition-all max-sm:-mt-3 border shadow-md text-black rounded-xl">
            <CardContent className="p-4">
              <CardTitle className="font-bold flex flex-row gap-2 max-md:text-lg">
                Your Question
                <span
                  onClick={() => {
                    textToAudio();
                  }}
                >

                  {paused ? <Volume2 className="cursor-pointer" /> :
                    <VolumeX className="cursor-pointer" />}
                </span>
              </CardTitle>
              <CardDescription className="capitalize max-sm:text-sm ">
                Question
              </CardDescription>
              <div className="mt-22 text-lg font-bold mt-3 max-sm:text-md">
                {" "}
                {randomQuiz[currentQuestion].questionText}
              </div>
            </CardContent>
          </Card>
          {/* {randomQuiz[currentQuestion].type==="open_ended"?<div className="flex space-x-6 w-full justify-center">
        <input ref={openRef} className=" w-full rounded-xl py-2 px-4 bg-slate-100  border-zinc-950 border text text-zinc-950" ></input>
        <Button
            onClick={() => {
              const input = openRef.current?.value
              if(input)
              HandleOption(input);
            }}
            size={"lg"}
            className="px-24 bg-slate-50 hover:bg-purple-400 capitalize hover:text-gray-200 text-black  py-6 rounded-xl"
            variant={"outline"}
          >
            Submit
          </Button>
        </div>
        : */}
          <div className="text-left mt-1">
            Choose the correct option from below
          </div>

          <div className="flex flex-col lg:flex-row gap-6 flex-wrap justify-center mt-6">
            {randomQuiz[currentQuestion].questionOptions.map(
              (option, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    HandleOption(option);
                  }}
                  size={"lg"}
                  className="w-full px-6 h-fit  border border-zinc-400 shadow-sm  bg-gradient-to-b hover:from-blue-600 hover:to-blue-800 capitalize hover:text-gray-200 text-black py-6 max-sm:py-3 rounded-xl "
                  variant={"outline"}
                >
                  <div className="text-wrap text-md md:text-lg"> {option}</div>
                </Button>
              )
            )}
          </div>
          {/* } */}
        </div>
      </>
    )
  );
}
