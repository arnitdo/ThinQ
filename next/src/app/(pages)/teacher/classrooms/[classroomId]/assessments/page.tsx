"use client";
import Loader from "@/components/Loader";
import SmallLoader from "@/components/SmallLoader";
import useAuthStore from "@/lib/zustand";
import { deleteLecture, getLectures } from "@/util/client/helpers";
import { AuthUser } from "@/util/middleware/auth";
import { ClassroomEnrollment, Lecture } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Form from "./(components)/Form";
import { toast } from "sonner";
import NestedNav, { NavLink } from "@/components/NestedNav";
import { motion } from "framer-motion";

const assessmentdata = [
    {
        title:"Operating System Round Robin",
        maxmarks: 10
    },
    {
        title:"Operating System FCFS",
        maxmarks: 10
    },
    {
        title:"Operating System SJF",
        maxmarks: 10
    },
    {
        title:"Operating System Priority",
        maxmarks: 10
    },
    {
        title:"Operating System LRU",
        maxmarks: 10
    },
    {
        title:"Operating System FIFO",
        maxmarks: 10
    },
    {
        title:"Operating System Optimal",
        maxmarks: 10
    },
    {
        title:"Operating System Paging",
        maxmarks: 10
    },
    {
        title:"Operating System Segmentation",
        maxmarks: 10
    },
    {
        title:"Operating System Deadlock",
        maxmarks: 10
    },
]

type ClassCardProps = {
  item: Lecture;
};

const Page = ({
  params: { classroomId },
}: {
  params: { classroomId: string };
}) => {
  const { user } = useAuthStore();
  const [data, setData] = useState<Lecture[]>([]);
  const [create, setCreate] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      if (!user) return;
      const lectures = await getLectures(user.userOrgId, classroomId);
      if (lectures) setData(lectures);
    };
    if (!create) getData();
  }, [user, create]);

  const ClassCard = ({ item }: ClassCardProps) => {
    const [faculty, setFaculty] = useState<AuthUser | null>(null);
    const [enrollments, setEnrollments] = useState<
      ClassroomEnrollment[] | null
    >(null);
    const [able, setAble] = useState(false);
    const handleClick = () => {
      setAble(!able);
    };

    function getStringDate(
      start: Date | string | number,
      end: Date | string | number
    ) {
      let date = new Date(start).toLocaleDateString().toString();
      return date;
    }

    function getStringTime(start: Date | string | number) {
      let time = new Date(start).toLocaleTimeString().toString();
      return time;
    }

    console.log({
      start: item.lectureStartTimestamp,
      end: item.lectureEndTimestamp,
    });
    // useEffect(() => {
    // 	const getClassData = async () => {
    // 		const faculty = await getFaculty(item.classroomOrgId, item.facultyUserId)
    // 		if (faculty) setFaculty(faculty)
    // 		const enrollments = await getEnrollments(item.classroomOrgId, item.classroomId)
    // 		if (enrollments) setEnrollments(enrollments)
    // 	}
    // 	getClassData()
    // }, [item.facultyUserId])

    async function handleDelete(lectureId: string) {
      if (!user) return;
      setData(data.filter((item) => item.lectureId !== lectureId));
      const res = await deleteLecture(user.userOrgId, classroomId, lectureId);
      if (res) toast.success("Classroom deleted successfully!");
    }
  

    return (
      <div
        key={item.lectureId}
        className="border rounded-[0.5rem] min-h-64 hover:shadow-xl transition-all"
      >
        <div className="h-fit p-4 bg-gradient-to-b rounded-t-[0.5rem]  from-blue-800 to-blue-950 flex justify-between items-center">
          <div className=" px-4 py-3 bg-blue-50 rounded-md">
            <h1 className="text-blue-600 font-bold text-xl">
              {item.title.slice(0, 2).toUpperCase()}
            </h1>
          </div>
          <h1 className="text-white text-2xl max-sm:text-xl">{item.title}</h1>
          <img
            src="/dots.svg"
            alt=""
            className="cursor-pointer"
            onClick={handleClick}
          />
        </div>
        <div className="p-4 relative">
          {able && (
            <div className="bg-white h-fit w-44 p-4 border -mt-6 rounded-md shadow-2xl absolute top-4 right-4">
              <div className="p-2 hover:bg-gray-200 rounded-sm cursor-pointer">
                Edit
              </div>
              <div
                onClick={() => {
                  handleDelete(item.lectureId);
                }}
                className="p-2 text-red-800 hover:bg-red-100 rounded-sm cursor-pointer"
              >
                Delete
              </div>
            </div>
          )}
          <div className=" flex flex-col gap-2 ">
            <h1 className="text-[#6C6C6C] flex flex-row justify-start items-center">
              Class Scheduled at:{" "}
              <span className="font-semibold px-2">
                {getStringDate(
                  item.lectureStartTimestamp,
                  item.lectureEndTimestamp
                )}
              </span>
            </h1>
            <div className=" flex flex-row gap-4 justify-start items-center">
              <div className=" py-1 px-3 rounded-full bg-primary text-white font-semibold text-ms">
                {getStringTime(item.lectureStartTimestamp)}
              </div>
              <h1 className=" font-bold text-xl text-zinc-950">-</h1>
              <div className=" py-1 px-3 rounded-full bg-secondary text-white font-semibold text-md">
                {getStringTime(item.lectureEndTimestamp)}
              </div>
            </div>
          </div>
          <h1 className="text-[#6C6C6C] mt-20 flex justify-start">
            Attendee:
            <img src="/attendee.svg" alt="" className="ml-2" /> +
            {enrollments ? (
              enrollments.length
            ) : (
              <span>
                <SmallLoader />
              </span>
            )}
          </h1>
        </div>
      </div>
    );
  };

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
  const onSubmit = (e: any) => {
    e.preventDefault();
    console.log("Submitted");
  };
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
        <Form create={create} setCreate={setCreate}/>
      )}
      <div className="p-4">
        <div className="Assessment font-medium text-5xl">Weekly Assessment</div>
        <div className="Assessments">
            {assessmentdata.map((item, index) => {
                return (
                    <div className="mt-6" key={index}>
                        <div className="lectureCard | grid hover:gap-[0.9375rem] grid-cols-[0_1fr] hover:grid-cols-[0.5rem_1fr] transition-[grid-template-columns] mb-6">
                  <div className="lectureCardActiveBar | bg-primary rounded-full"></div>
                  <div className="p-[0.9375rem] border border-[#7C7A7A] rounded-[0.3125rem] bg-[hsl(0,0%,95%,20%)] hover:shadow-[0_8px_15.1px_hsl(0,1%,25%,10%)] flex justify-between items-center">
                    <div>
                      
                      <h2 className="text-xl font-medium text-black">
                        {item.title}
                      </h2>
                      
                      
                      
                    </div>
                    {user && (
                      <Link
                        href={`/teacher/classrooms/${classroomId}/assessments/anythingn`}
                        className="calendarJoinButton | px-[1.375rem] py-[0.375rem] rounded-full border border-[#9F9F9F] text-sm font-medium text-[#6F6F6F] hover:text-white hover:border-none"
                      >
                        <h1>Maximum Marks: {item.maxmarks}</h1>
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
