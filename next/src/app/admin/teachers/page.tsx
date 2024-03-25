"use client";
import React from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useState } from "react";
const data = [
  {
    id: 1,
    name: "Rajesh Patil",
    date_updated: "2 days ago",
    classInc: "Comps-1",
  },
  {
    id: 2,
    name: "Rishabh Pandey",
    date_updated: "2 days ago",
    classInc: "Comps-1",
  },
  {
    id: 3,
    name: "Varad Dubey",
    date_updated: "2 days ago",
    classInc: "Comps-3",
  },
  {
    id: 4,
    name: "Milind Singh",
    date_updated: "2 mins ago",
    classInc: "IT-1",
  },
  {
    id: 4,
    name: "Arnav Shukla",
    date_updated: "1 days ago",
    classInc: "Comps-2",
  },
];
const Page = () => {
  const [create, setCreate] = useState(false);
  const handleClick = () => {
    setCreate(!create);
  };
  return (
    <div className="py-4 px-5 h-dvh">
      <div className="gridWrapper | text-[#6C6C6C] grid grid-cols-[auto_1fr] gap-3 h-full | md:grid-cols-[248px_1fr]">
        <Sidebar />
        <div className="rightWrapper | ">
          <header className="font-medium p-[1.125rem] max-sm:p-2 border border-[#8C8C8C] rounded-[0.5rem] flex items-center justify-between mb-4 sticky top-3 bg-white">
            <h1 className="text-xl max-sm:text-lg">Hello 👋, Admin</h1>
            <div className="flex gap-6 items-center">
              <button className="hidden | md:block py-[0.625rem] px-5 text-[#847700] bg-[hsl(68,100%,64%,32%)] border border-[#9D8E00] rounded-full">
                Upgrade
              </button>
              <div className="ignoreThisDiv line | border"></div>
              <div className="grid place-items-center text-black bg-[#D9D9D9] w-[2.0625rem] h-[2.0625rem] aspect-square rounded-[50%]">
                R
              </div>
            </div>
          </header>

          <div className="flex justify-between items-center">
            <nav className="font-medium p-2 flex gap-[1.875rem] border-b max-sm:gap-3 max-sm:text-sm">
              <Link href="/admin/classrooms">Classrooms</Link>
              <Link href="/admin/teachers" className="underline">
                Teachers
              </Link>
              <Link href="/admin/students">Students</Link>
            </nav>
            <button
              className="hidden | md:block py-[0.625rem] px-5 rounded-full border border-[#CBCBCB]"
              onClick={handleClick}
            >
              + Create
            </button>
          </div>
          {create && (
            <div className="absolute bg-black w-full h-full top-0 left-0 bg-opacity-40">
              <div className="modal-form bg-white w-4/12 max-md:w-fit p-6 mx-auto my-36 rounded-md shadow-lg">
                <div className="flex justify-between items-center">
                  <h2 className="text-black font-semibold text-xl mb-3">
                    Create New Teacher
                  </h2>
                  <button onClick={handleClick}>X</button>
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

          <main className="py-4 max-sm:text-sm">
            <table>
              <thead>
                <tr>
                  <th>Teacher Name</th>
                  <th>Date Updated</th>
                  <th>Class Inc</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.date_updated}</td>
                    <td>{item.classInc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Page;
