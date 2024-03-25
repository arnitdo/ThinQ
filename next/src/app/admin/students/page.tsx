"use client";
import { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import useAuthStore from "@/lib/zustand";
import { getStudents } from "@/util/client/helpers";
import { AuthUser } from "@/util/middleware/auth";

const Page = () => {
  const [data, setData] = useState<AuthUser[]>([]);
  const [create, setCreate] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const {user} = useAuthStore()

  useEffect(() => {
    const getData = async () => {
      if (!user) return;
      const students = await getStudents(user.userOrgId)
      if (students) setData(students)
    }
    getData()
  }, [user])

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      const updatedData = data.filter((item) => item.userId !== id);
      setData(updatedData);
      setShowToast(true);
    }
  };
  const handleClick = () => {
    setCreate(!create);
  };


  const handleEdit = (id: string) => {
    alert(id);
  };

  return (
    <>

      <div className="flex justify-between items-end border-b pb-2">
        <nav className="font-medium p-2 flex gap-[1.875rem] max-sm:gap-3 max-sm:text-sm">
          <Link href="/admin/classrooms" className="">Classrooms</Link>
          <Link href="/admin/teachers" className="">
            Teachers
          </Link>
          <Link href="/admin/students" className="relative text-black | after:content-[''] after:absolute after:-bottom-4 after:left-0 after:w-full after:h-1 after:rounded-full after:bg-[#0A349E]">Students</Link>
        </nav>
        <button
          className="hidden | md:block py-[0.625rem] px-5 rounded-full border border-[#CBCBCB]"
          onClick={handleClick}
        >
          + Create
        </button>
      </div>
      {create && (
        <div className="absolute isolate bg-black w-full h-full top-0 left-0 bg-opacity-40">
          <div className="modal-form bg-white w-4/12 max-md:w-fit p-6 mx-auto my-36 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-3 text-black">
              <h2 className="font-semibold text-xl">
                Create New Teacher
              </h2>
              <button onClick={handleClick} className="">X</button>
            </div>
            <form className="max-w-md mx-auto">
              <div className="mb-4">
                <label htmlFor="name" className="block mb-1">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full border rounded-md py-2 px-3"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="class" className="block mb-1">
                  Class:
                </label>
                <input
                  type="text"
                  id="class"
                  className="w-full border rounded-md py-2 px-3"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block mb-1">
                  Date:
                </label>
                <input
                  type="date"
                  id="date"
                  className="w-full border rounded-md py-2 px-3"
                />
              </div>

              <button
                type="submit"
                className="bg-gradient-to-b from-blue-700 to-blue-900 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Create
              </button>

            </form>
          </div>
        </div>
      )}
      {
        showToast && (<div className="absolute w-full h-full bg-opacity-40 top-0 left-0">
          <div className="bg-white w-fit max-md:w-fit p-6 mx-auto my-10 rounded-md shadow-lg border border-red-400">
            <div className="flex justify-between items-center">
              <h2 className="text-black font-semibold text-xl mb-3">
                Student Deleted
              </h2>

            </div>
          </div>
        </div>)
      }
      <main className="py-4 max-sm:text-xs overflow-auto text-[#525354] tables">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-start w-1/2 p-3 border-b">Student Name</th>
              <th className="text-start p-3 border-b items-center flex">Username <img src="/sidebarCalendar.png" alt="" className="inline-block ml-2 w-4" /></th>
              <th className="border-b"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.userId}>
                <td className="p-3 border-b">{item.userDisplayName}</td>
                <td className="p-3 border-b">{item.userName}</td>
                <td className="p-3 border-b">
                  <div className="flex gap-3">
                    <img src="/deleteIcon.svg" alt="" className="cursor-pointer rounded-sm hover:bg-red-200 w-5" onClick={() => handleDelete(item.userId)} />
                    <img src="/renameIcon.svg" alt="" className="cursor-pointer rounded-sm hover:bg-gray-200 w-5" onClick={() => handleEdit(item.userId)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
};


export default Page;

