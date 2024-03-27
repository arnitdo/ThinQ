"use client";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import {toast} from "sonner";
import { Volume2 } from "lucide-react";
import { QuizQuestion } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function QuizCard({
  QuizArray,
  lectureId,
  classId,
  attemptId
}: {
  QuizArray: QuizQuestion[];
  lectureId: string;
  classId: string;
  attemptId: string;
}) {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [coin, setcoin] = React.useState(0)
  let random = Math.floor(Math.random() * QuizArray.length);
  let randomQuiz: QuizQuestion[] = [];
  const router = useRouter()
  for (let i = 0; i < QuizArray.length; i++) {
    randomQuiz.push(QuizArray[random]);
  }
  useEffect(() => {
    if (!QuizArray[currentQuestion+1]) {
      // redirect("/home")
      // alert("You have completed the quiz");
    }
  }, [currentQuestion])


  const checker = (correctInd:number, option:string) => {
    return randomQuiz[currentQuestion].questionOptions[correctInd] === option;
  }
  // const saveRecord = async (questionId: string, correctAnswerInd: number, selectedAnswer: string, quizId: string) => {
  //   try {
  //     const res = await fetch(`/api/orgs/test/classroom/${classId}/lecture/${lectureId}/quiz/${quizId}/attempt/${attemptId}/response?questionId=${questionId}`,{
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
    // const addAttemptedQuestion = await saveRecord(randomQuiz[currentQuestion].questionId, randomQuiz[currentQuestion].questionAnswerIndex,option,randomQuiz[currentQuestion].quizId)
    if (checker(randomQuiz[currentQuestion].questionAnswerIndex, option)) {
      setCorrect([...correct, option]);
      toast.success(`Correct Answer +${randomQuiz[currentQuestion].questionOptions[randomQuiz[currentQuestion].questionAnswerIndex]} 🪙`);
      // setcoin(coin+randomQuiz[currentQuestion].coins);
    } else {
      toast.error("Wrong Answer"); 
    }
    if(currentQuestion===randomQuiz.length-1){
      router.push("/student/quizzes")
      return
    }
    setCurrentQuestion(currentQuestion + 1);
  };
  
  const textToAudio=()=>{
    const text = randomQuiz[currentQuestion].questionText.replaceAll(/_/g, "")+" "+randomQuiz[currentQuestion].questionOptions.join(", ");
    let msg = text;
    
    let speech = new SpeechSynthesisUtterance();
    speech.lang = `en-US`;
    
    speech.text = msg;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    
    window.speechSynthesis.speak(speech);
    // speechSynthesis.cancel();
}

  return randomQuiz[currentQuestion]&&(
    <>
      <div className=" space-y-6 md:space-y-16 lg:space-y-24 px-6 md:px-12 lg:px-24">
        <h1 className={`${coin>0?"opacity-100":"opacity-0"} transition-all font-bold text-xl text-center`}> Total coins earned : {coin}🪙</h1>
        <Card className=" w-full p-8 bg-slate-200 text-black rounded-xl">
          <CardContent className="space-y-3  ">
            <CardTitle className="font-bold flex flex-row gap-2">Your Question<span onClick={()=>{textToAudio()}}><Volume2/></span></CardTitle>
            <CardDescription className="capitalize ">
               Question
            </CardDescription>
            <div className="mt-22 text-lg">
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
        <div className="flex flex-col lg:flex-row gap-6 flex-wrap justify-center">
          <Button
            onClick={() => {
              HandleOption(randomQuiz[currentQuestion].questionOptions[0]);
            }}
            size={"lg"}
            className="px-24 bg-slate-50 hover:bg-purple-400 capitalize hover:text-gray-200 text-black  py-6 rounded-xl "
            variant={"outline"}
          >
            {randomQuiz[currentQuestion].questionOptions[0]}
          </Button>
          <Button
            onClick={() => {
              HandleOption(randomQuiz[currentQuestion].questionOptions[1]);
            }}
            size={"lg"}
            className="px-24 bg-slate-50 hover:bg-purple-400 capitalize hover:text-gray-200 text-black py-6 rounded-xl "
            variant={"outline"}
          >
            {randomQuiz[currentQuestion].questionOptions[1]}
          </Button>
          <Button
            onClick={() => {
              HandleOption(randomQuiz[currentQuestion].questionOptions[2]);
            }}
            size={"lg"}
            className="px-24 bg-slate-50 hover:bg-purple-400 capitalize hover:text-gray-200 text-black py-6 rounded-xl "
            variant={"outline"}
          >
            {randomQuiz[currentQuestion].questionOptions[2]}
          </Button>
          <Button
            onClick={() => {
              HandleOption(randomQuiz[currentQuestion].questionOptions[3]);
            }}
            size={"lg"}
            className="px-24 bg-slate-50 hover:bg-purple-400 capitalize hover:text-gray-200 text-black py-6 rounded-xl "
            variant={"outline"}
          >
            {randomQuiz[currentQuestion].questionOptions[3]}
          </Button>
        </div>
        {/* } */}
      </div>
    </>
  );
}

    
  