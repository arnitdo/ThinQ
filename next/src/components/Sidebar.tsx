"use client"
import React, { useState } from "react";
import Link from "next/link";
const Sidebar = () => {
    // const [sidebarActive, setSidebarActive] = useState(false);
    // const handleClick = () =>{
    //     setSidebarActive(!sidebarActive);
    // }
  return (
    <>
      <div className='leftWrapper | h-full'>
          <nav className="sideBar | max-sm:p-1  p-[1.125rem] border border-[#8C8C8C] rounded-[0.5rem] h-[96vh] flex flex-col justify-between sticky top-3">
            <div>
              <div className='mb-5 flex justify-between items-center'>
                <img src="/sidebarMobileLogo.png" alt="" className={`w-8 max-sm:w-6 ml-2 mt-2 md:hidden`}/>
                <img src="/bigblack.png" alt="" className={`hidden | md:block max-w-20`}/>
                <img src="/sidebarOpenCloseButton.png" alt="" className='hidden | md:block cursor-pointer'/>
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

            <div className='p-[0.625rem] items-center rounded-[0.3125rem] border border-[#646464] hover:bg-[#ECECEc] shadow-[0_4px_33.3px_hsl(0,0%,0%,16%)] flex gap-3'>
              <img src="/sidebarPremium.png" alt="" />
              <p className='hidden | md:block'>Premium</p>
            </div>
          </nav>
        </div>
        
    </>
  );
};

export default Sidebar;
