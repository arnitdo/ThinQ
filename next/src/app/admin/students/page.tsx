import React from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
const Page = () => {
  return (
    <div className="py-4 px-5 h-dvh">
      <div className="gridWrapper | text-[#6C6C6C] grid grid-cols-[auto_1fr] gap-3 h-full | md:grid-cols-[248px_1fr]">
        <Sidebar />
        <div className='rightWrapper | '>
          <header className='font-medium p-[1.125rem] border border-[#8C8C8C] rounded-[0.5rem] flex items-center justify-between mb-4 sticky top-3 bg-white'>
            <h1 className='text-xl'>Hello 👋, Admin</h1>
            <div className='flex gap-6 items-center'>
              <button className='hidden | md:block py-[0.625rem] px-5 text-[#847700] bg-[hsl(68,100%,64%,32%)] border border-[#9D8E00] rounded-full'>Upgrade</button>
              <div className="ignoreThisDiv line | border"></div>
              <div className='grid place-items-center text-black bg-[#D9D9D9] w-[2.0625rem] h-[2.0625rem] aspect-square rounded-[50%]'>R</div>
            </div>
          </header>

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
              >
              {/* onClick function left to add on this button, present in /teachers */}
              + Create
            </button>
          </div>

          <main className='py-4' >
            Student goes here
          </main>
        </div>
      </div>
    </div>
  );
};

export default Page;
