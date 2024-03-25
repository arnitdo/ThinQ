"use client"
import React from 'react'
import Link from 'next/link'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
// import Navbar from '../../components/Navbar'
const data =[
  {
    id: 1,
    year: 'SE',
    branch: 'Comps-1',
    classInc: 'Rajesh Patil',
    Attendee: '30',
  },
  {
    id: 2,
    year: 'FE',
    branch: 'IT-1',
    classInc: 'Rajesh Patil',
    Attendee: '30',
  },
  {
    id: 3,
    year: 'FE',
    branch: 'IT-1',
    classInc: 'Rajesh Patil',
    Attendee: '30',
  },
  {
    id: 4,
    year: 'FE',
    branch: 'IT-1',
    classInc: 'Rajesh Patil',
    Attendee: '30',
  },


  

]
const Page = () => {
  const [create, setCreate] = useState(false);
  const handlCreate = () => {
    setCreate(!create);
  };
  const [clickedCardId, setClickedCardId] = useState(null)
  const handleClick = (id: any) => {
    if (clickedCardId === id) {
      setClickedCardId(null); // Toggle off if already clicked
    } else {
      setClickedCardId(id);
    }
  };
  return (
    <div className='py-4 px-5 h-dvh'>
      <div className='gridWrapper | text-[#6C6C6C] grid grid-cols-[auto_1fr] gap-3 h-full | md:grid-cols-[248px_1fr]'>
        <Sidebar />

        <div className='rightWrapper | '>
          <header className='font-medium p-[1.125rem] max-sm:p-2 border border-[#8C8C8C] rounded-[0.5rem] flex items-center justify-between mb-4 sticky top-3 bg-white'>
            <h1 className='text-xl  max-sm:text-lg'>Hello 👋, Admin</h1>
            <div className='flex gap-6 items-center'>
              <button className='hidden | md:block py-[0.625rem] px-5 text-[#847700] bg-[hsl(68,100%,64%,32%)] border border-[#9D8E00] rounded-full'>Upgrade</button>
              <div className="ignoreThisDiv line | border"></div>
              <div className='grid place-items-center text-black bg-[#D9D9D9] w-[2.0625rem] h-[2.0625rem] aspect-square rounded-[50%]'>R</div>
            </div>
          </header>

          <div className="flex justify-between items-end border-b pb-2">
            <nav className="font-medium p-2 flex gap-[1.875rem] max-sm:gap-3 max-sm:text-sm">
              <Link href="/admin/classrooms" className="relative text-black | after:content-[''] after:absolute after:-bottom-4 after:left-0 after:w-full after:h-1 after:rounded-full after:bg-[#0A349E]">Classrooms</Link>
              <Link href="/admin/teachers" className="">
                Teachers
              </Link>
              <Link href="/admin/students" className="">Students</Link>
            </nav>
            <button
              className="hidden | md:block py-[0.625rem] px-5 rounded-full border border-[#CBCBCB]"
              >
              {/* onClick function left to add on this button, present in /teachers */}
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
                  <button onClick={handlCreate}>X</button>
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

          <main className='py-4' >
            <div className='grid grid-cols-3 gap-3 max-sm:grid-cols-1 max-[1000px]:grid-cols-2'>
            {data.map((item) => (
                    <div key={item.id} className=' border rounded-[0.5rem] min-h-64 hover:shadow-xl transition-all'>
                      <div className='h-fit p-4 bg-gradient-to-b rounded-t-[0.5rem]  from-blue-800 to-blue-950 flex justify-between items-center'>
                      <div className=' px-4 py-3 bg-blue-50 rounded-md'>
                        <h1 className='text-blue-600 font-bold text-xl'>{item.year}</h1>
                      </div>
                      <h1 className='text-white text-2xl'>{item.branch}</h1>
                      <img src="/dots.svg" alt="" className='cursor-pointer' onClick={() => handleClick(item.id)}/>
                      </div>
                      <div className='p-4'>
                        {clickedCardId === item.id && (
                          <div className='bg-white h-fit w-44 p-4 border -mt-6 rounded-md shadow-2xl absolute ml-28'>
                            <div className='p-2 hover:bg-gray-200 rounded-sm cursor-pointer'>Edit</div>
                            <div className='p-2 text-red-800 hover:bg-red-100 rounded-sm cursor-pointer'>Delete</div>
                          </div>
                        )}
                        <h1 className='text-[#6C6C6C]'>Class Incharge: {item.classInc}</h1>
                        <h1 className='text-[#6C6C6C] mt-20 flex'>Attendee: <img src="/attendee.svg" alt="" className='ml-2' /> +{Number(item.Attendee) - 3}</h1>
                      </div>
                      
                    </div>
                  ))}
            </div>
          </main>
        </div>

        <div className="createIconMobile cursor-pointer | md:hidden text-4xl w-[70px] aspect-square bg-white rounded-[50%] shadow-[0_0.25rem_1.75rem_hsl(0,0%,30%,25%)] grid place-items-center fixed bottom-4 right-4" onClick={handlCreate}>+</div>
      </div>
    </div>
  )
}

export default Page