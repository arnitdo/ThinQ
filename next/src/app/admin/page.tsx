import React from 'react'
import Navbar from '../../components/Navbar'
const page = () => {
  return (
    <div className='py-4 px-5 h-dvh'>
      <div className='gridWrapper | text-[#6C6C6C] grid grid-cols-[auto_1fr] gap-3 h-full | md:grid-cols-[248px_1fr]'>
        <div className='leftWrapper | h-full'>
          <nav className="sideBar |  p-[1.125rem] border border-[#8C8C8C] rounded-[0.5rem] h-full flex flex-col justify-between">
            <div>
              <div className='mb-5 flex justify-between'>
                <img src="sidebarMobileLogo.png" alt="" className='w-full md:hidden'/>
                <img src="bigblack.png" alt="" className='hidden | md:block max-w-20'/>
                <img src="sidebarOpenCloseButton.png" alt="" className='hidden | md:block'/>
              </div>

              <div className='p-[0.625rem] rounded-[0.3125rem] hover:bg-[#ECECEc] mb-3 flex gap-3'>
                <img src="sidebarHome.png" alt="" />
                <p className='hidden | md:block'>Home</p>
              </div>

              <div className='p-[0.625rem] rounded-[0.3125rem] hover:bg-[#ECECEc] flex gap-3'>
                <img src="sidebarCalendar.png" alt="" />
                <p className='hidden | md:block'>Calendar</p>
              </div>
            </div>

            <div className='p-[0.625rem] rounded-[0.3125rem] border border-[#646464] hover:bg-[#ECECEc] shadow-[0_4px_33.3px_hsl(0,0%,0%,16%)] flex gap-3'>
              <img src="sidebarPremium.png" alt="" />
              <p className='hidden | md:block'>Premium</p>
            </div>
          </nav>
        </div>

        <div className='rightWrapper |'>
          <header className='font-medium p-[1.125rem] border border-[#8C8C8C] rounded-[0.5rem] flex justify-between mb-4'>
            <h1 className='text-xl'>Hello 👋, Admin</h1>
            <div className='flex gap-6'>
              <button className='hidden | md:block py-[0.625rem] px-5 text-[#847700] bg-[hsl(68,100%,64%,32%)] border border-[#9D8E00] rounded-full'>Upgrade</button>
              <div className="ignoreThisDiv line | border"></div>
              <div className='grid place-items-center text-black bg-[#D9D9D9] w-[2.0625rem] h-[2.0625rem] aspect-square rounded-[50%]'>R</div>
            </div>
          </header>

          <div className='flex justify-between'>
            <nav className='font-medium p-2 flex gap-[1.875rem]'>
              <a href="">Classrooms</a>
              <a href="">Teachers</a>
              <a href="">Students</a>
            </nav>
            <button className='hidden | md:block py-[0.625rem] px-5 rounded-full border border-[#CBCBCB]'>+ Create</button>
          </div>

          <main>*cards here*</main>
        </div>

        <div className="createIconMobile | md:hidden text-4xl w-[70px] aspect-square bg-white rounded-[50%] shadow-[0_0.25rem_1.75rem_hsl(0,0%,30%,25%)] grid place-items-center fixed bottom-4 right-4">+</div>
      </div>
    </div>
  )
}

export default page
