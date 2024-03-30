"use client";
import useAuthStore from "@/lib/zustand";
import Link from "next/link";
import { useEffect, useState } from "react";
import Form from "./(components)/Form";
import NestedNav, { NavLink } from "@/components/NestedNav";
import { ClassroomAssessmentWithQuestions } from "@/util/api/api_responses";
import { getAssessments } from "@/util/client/helpers";

const Page = ({
  params: { classroomId },
}: {
  params: { classroomId: string };
}) => {
  const { user } = useAuthStore();
  const [data, setData] = useState<ClassroomAssessmentWithQuestions[]>([]);
  const [create, setCreate] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      if (!user) return;
      const lectures = await getAssessments(user.userOrgId, classroomId);
      if (lectures) setData(lectures);
    };
    if (!create) getData();
  }, [user, create]);

  const navlinks: NavLink[] = [
    {
      href: `/teacher/classrooms/${classroomId}/lectures`,
      title: "Lectures",
    },
    {
      href: `/teacher/classrooms/${classroomId}/quiz`,
      title: "Quizzes",
    },
    {
      href: `/teacher/classrooms/${classroomId}/notes`,
      title: "Notes",
    },
    {
      href: `/teacher/classrooms/${classroomId}/assessments`,
      title: "Assessments",
    },
  ];
  const handleCreate = () => {
    setCreate(!create);
};

  return (
    <>
      <NestedNav
        items={navlinks}
        button={
          <button
            className="hidden | md:block py-[0.625rem] px-5 rounded-full border border-[#CBCBCB]"
            onClick={handleCreate}
          >
            {/* onClick function left to add on this button, present in /teachers */}
            + Create
          </button>
        }
      />
      {create && (
        <Form classroomId={classroomId} create={create} setCreate={setCreate}/>
      )}
      <div className="p-4">
        <div className="Assessment font-medium text-5xl">Weekly Assessment</div>
        <div className="Assessments">
            {data.map((item, index) => {
                return (
                    <div className="mt-6" key={item.assessmentId}>
                        <div className="lectureCard | grid hover:gap-[0.9375rem] grid-cols-[0_1fr] hover:grid-cols-[0.5rem_1fr] transition-[grid-template-columns] mb-6">
                  <div className="lectureCardActiveBar | bg-primary rounded-full"></div>
                  <div className="p-[0.9375rem] border border-[#7C7A7A] rounded-[0.3125rem] bg-[hsl(0,0%,95%,20%)] hover:shadow-[0_8px_15.1px_hsl(0,1%,25%,10%)] flex justify-between items-center">
                    <div>
                      
                      <h2 className="text-xl font-medium text-black">
                        {item.assessmentTitle}
                      </h2>
                    </div>
                    {user && (
                      <Link
                        href={`/teacher/classrooms/${classroomId}/assessments/${item.assessmentId}`}
                        className="calendarJoinButton | px-[1.375rem] py-[0.375rem] rounded-full border border-[#9F9F9F] text-sm font-medium text-[#6F6F6F] hover:text-white hover:border-none"
                      >
                        <h1>Maximum Marks: {item.assessmentQuestions.reduce((prev, item) => {return prev + item.questionMarks}, 0)}</h1>
                      </Link>
                    )}
                  </div>
                </div>
                    </div>
                );
            })}
        </div>
      </div>
      
    </>
  );
};

export default Page;
