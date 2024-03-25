"use client"
import React from 'react'
import Link from 'next/link'
import { useState } from 'react'
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
        <div className='leftWrapper | h-full'>
          <nav className="sideBar |  p-[1.125rem] border border-[#8C8C8C] rounded-[0.5rem] h-screen flex flex-col justify-between sticky top-3">
            <div>
              <div className='mb-5 flex justify-between items-center'>
                <img src="/sidebarMobileLogo.png" alt="" className='w-full md:hidden'/>
                <img src="/bigblack.png" alt="" className='hidden | md:block max-w-20'/>
                <img src="sidebarOpenCloseButton.png" alt="" className='hidden | md:block'/>
              </div>

              <div className='p-[0.625rem] rounded-[0.3125rem] hover:bg-[#ECECEc] mb-3 flex gap-3 items-center'>
                <img src="/sidebarHome.png" alt="" />
                <p className='hidden | md:block'>Home</p>
              </div>

              <div className='p-[0.625rem] rounded-[0.3125rem] hover:bg-[#ECECEc] flex gap-3 items-center'>
                <img src="/sidebarCalendar.png" alt="" />
                <p className='hidden | md:block'>Calendar</p>
              </div>
            </div>

            <div className='p-[0.625rem] rounded-[0.3125rem] border border-[#646464] hover:bg-[#ECECEc] shadow-[0_4px_33.3px_hsl(0,0%,0%,16%)] flex gap-3'>
              <img src="/sidebarPremium.png" alt="" />
              <p className='hidden | md:block'>Premium</p>
            </div>
          </nav>
        </div>

        <div className='rightWrapper | '>
          <header className='font-medium p-[1.125rem] border border-[#8C8C8C] rounded-[0.5rem] flex items-center justify-between mb-4 sticky top-3 bg-white'>
            <h1 className='text-xl'>Hello 👋, Admin</h1>
            <div className='flex gap-6 items-center'>
              <button className='hidden | md:block py-[0.625rem] px-5 text-[#847700] bg-[hsl(68,100%,64%,32%)] border border-[#9D8E00] rounded-full'>Upgrade</button>
              <div className="ignoreThisDiv line | border"></div>
              <div className='grid place-items-center text-black bg-[#D9D9D9] w-[2.0625rem] h-[2.0625rem] aspect-square rounded-[50%]'>R</div>
            </div>
          </header>

          <div className='flex justify-between items-center'>
            <nav className='font-medium p-2 flex gap-[1.875rem] border-b'>
              <Link href="/admin/classrooms" className='underline'>Classrooms</Link>
              <Link href="/admin/teachers">Teachers</Link>
              <Link href="/admin/students">Students</Link>
            </nav>
            <button className='hidden | md:block py-[0.625rem] px-5 rounded-full border border-[#CBCBCB]'>+ Create</button>
          </div>

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

        <div className="createIconMobile | md:hidden text-4xl w-[70px] aspect-square bg-white rounded-[50%] shadow-[0_0.25rem_1.75rem_hsl(0,0%,30%,25%)] grid place-items-center fixed bottom-4 right-4">+</div>
      </div>
    </div>
  )
}

export default Page
