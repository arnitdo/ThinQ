"use client";
import {useEffect, useState} from "react";
import Link from "next/link";
import useAuthStore from "@/lib/zustand";
import {getStudentCalender} from "@/util/client/helpers";
import {BaseCalendar} from "@/components/ui/baseCalender";
import Lottie from "lottie-react";
import animationData from "../../../../../public/nolecture.json";

type calenderData = {
  lectureId: string;
  title: string;
  lectureStartTimestamp: Date;
  lectureEndTimestamp: Date;
  lectureClassroom: {
    classroomId: string;
    classroomName: string;
    facultyUserId: string;
    User: {
      userDisplayName: string;
    };
    _count: {
      classroomEnrollments: number;
    };
  };
};
export default function Page() {
  const [data, setData] = useState<calenderData[]>([]);
  const [currDate, setCurrDate] = useState<Date>(new Date());
  const { user } = useAuthStore();
  const [showData, setShowData] = useState<calenderData[]>([]);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  useEffect(() => {
    setShowData(
      data.filter((item) => {
        return (
          new Date(item.lectureStartTimestamp).getDate() === currDate.getDate()
        );
      })
    );
  }, [data, currDate]);

  useEffect(() => {
    const getData = async () => {
      const response = await getStudentCalender(user!.userOrgId);
      console.log(response);
      if (response) setData(response);
    };
    if (user) getData();
  }, [user]);

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const day =
    new Date(currDate).toLocaleDateString() === new Date().toLocaleDateString()
      ? "Today"
      : new Date(currDate).toLocaleDateString() ===
        new Date(Date.now() + 1000 * 60 * 60 * 24).toLocaleDateString()
      ? "Tomorrow"
      : new Date(currDate).toLocaleDateString() ===
        new Date(Date.now() - 1000 * 60 * 60 * 24).toLocaleDateString()
      ? "Yesterday"
      : days[new Date(currDate).getDay()];
  return (
    <>
      <div className="p-6 border border-[#8C8C8C] rounded-[0.5rem]">
        <div className="flex justify-between items-end mb-7 out">
          <div>
            <p className="text-xs font-medium text-[#7E7E7E]">{day}</p>
            <div className="flex gap-4 max-sm:flex-col">
              <h2 className="text-[1.75rem] font-medium text-[#575757]">
                {new Date(currDate).toDateString().slice(4)}
              </h2>
              <div className="dayChangeButtons flex">
                <button
                  onClick={() =>
                    setCurrDate(
                      new Date(currDate.getTime() - 1000 * 60 * 60 * 24)
                    )
                  }
                  className="py-1 px-[0.3125rem] bg-[hsl(0,0%,95%)] hover:bg-[hsl(0,0%,85%)] rounded-[0.5rem_0_0_0.5rem]"
                >
                  <img src="/calendarDayNavigation.svg" alt="" />
                </button>
                <button
                  onClick={() =>
                    setCurrDate(
                      new Date(currDate.getTime() + 1000 * 60 * 60 * 24)
                    )
                  }
                  className="py-1 px-[0.3125rem] bg-[hsl(0,0%,95%)] hover:bg-[hsl(0,0%,85%)] rounded-[0_0.5rem_0.5rem_0]"
                >
                  <img
                    src="/calendarDayNavigation.svg"
                    alt=""
                    className="rotate-180"
                  />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setShowDatePicker(!showDatePicker);
            }}
            className="calendarIcon | bg-[hsl(0,0%,95%)] relative hover:bg-[hsl(0,0%,85%)] p-[0.625rem] rounded-[0.5rem]"
          >
            <img src="/sidebarCalendar.svg" alt="" />
            {showDatePicker && (
              <div className=" absolute top-10 right-0">
                <BaseCalendar
                  mode="single"
                  selected={currDate}
                  onSelect={(value) => {
                    if (!value) return;
                    setCurrDate(value);
                    setShowDatePicker(false);
                  }}
                  className="rounded-md border"
                />
              </div>
            )}
          </button>
        </div>

        <div>
          <div className="lectureCardContainer">
            {showData.length === 0 && (
              <div className="">
                <Lottie className="h-[40vh]" animationData={animationData} />
                <div className="text-3xl font-bold text-center mt-8 mb-4">
                  {" "}
                  Hurray Nothing for the day 🥳
                </div>
              </div>
            )}
            {showData.map((item, index) => (
              <div key={item.lectureId}>
                <p className="flex gap-1 text-xs font-medium text-[#7E7E7E] mb-2 mt-10">
                  <span className="lectureStartTime">
                    {formatTime(item.lectureStartTimestamp.toString())}
                  </span>
                  -
                  <span className="lectureEndTime">
                    {formatTime(item.lectureEndTimestamp.toString())}
                  </span>
                </p>
                <div className="lectureCard | grid hover:gap-[0.9375rem] grid-cols-[0_1fr] hover:grid-cols-[0.5rem_1fr] transition-[grid-template-columns]">
                  <div className="lectureCardActiveBar | bg-primary rounded-full"></div>
                  <div className="p-[0.9375rem] border border-[#7C7A7A] rounded-[0.3125rem] bg-[hsl(0,0%,95%,20%)] shadow-[0_8px_15.1px_hsl(0,1%,25%,10%)] flex justify-between items-center">
                    <div>
                      <div className="lectureClass | text-secondary text-[0.5rem] font-bold bg-[hsl(318,93%,55%,14%)] border border-secondary py-[0.3125rem] px-[0.6875rem] rounded-full w-max mb-2">
                        Comp-3
                      </div>
                      <h2 className="text-xl font-medium text-black">
                        {item.title}
                      </h2>
                      <h3 className="text-[0.9375rem] text-[#A1A1A1]">
                        Classroom:{" "}
                        <span>{item.lectureClassroom.classroomName}</span>
                      </h3>
                      <h3 className="text-[0.9375rem] text-[#A1A1A1]">
                        Faculty:{" "}
                        <span>
                          {item.lectureClassroom.User.userDisplayName}
                        </span>
                      </h3>
                      <h3 className="text-[0.9375rem] text-[#A1A1A1]">
                        Attendance:{" "}
                        <span>
                          {item.lectureClassroom._count.classroomEnrollments}
                        </span>
                      </h3>
                    </div>
                    <Link
                      href={"/"}
                      className="calendarJoinButton | px-[1.375rem] py-[0.375rem] rounded-full border border-[#9F9F9F] text-sm font-medium text-[#6F6F6F] hover:text-white hover:border-none"
                    >
                      <button className="">
                        Join <span className="">{">"}</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
