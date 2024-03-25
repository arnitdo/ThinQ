"use client"
import React, { useState } from "react";
import { logout } from "@/util/client/helpers";
import useAuthStore from "@/lib/zustand";
const Sidebar = () => {
  const [sidebarActive, setSidebarActive] = useState(true);
  const { signout } = useAuthStore();
  const handleClick = () => {
    setSidebarActive(!sidebarActive);
  }
  async function handleSignout() {
    const response = await logout();
    if (response) {
      signout();
    }
  }

  return (
    <>
      <div className='leftWrapper | h-full'>
        <nav className="sideBar | max-sm:p-1  p-[1.125rem] border border-[#8C8C8C] rounded-[0.5rem] h-[96vh] flex flex-col justify-between sticky top-3 md:w-[248px] has-[:checked]:w-auto">
          <div>
            <div className='mb-5 flex justify-between items-center | has-[:checked]:flex-col has-[:checked]:items-center has-[:checked]:gap-3'>
              <img src="/sidebarMobileLogo.png" alt="" className={`w-[calc(100%_-_0.5rem)] mx-auto mt-2 md:hidden`} />
              {sidebarActive && (
                <img src="/bigblack.png" alt="" className={`hidden | md:block max-w-20`} />
              )}
              {!sidebarActive && (
                <img src="/sidebarMobileLogo.png" alt="" className={`hidden | md:block w-8 max-sm:w-6 mt-2 mb-3`} />
              )}

              <label htmlFor="sidebarClose" className="hidden | md:block">
                <input type="checkbox" name="sidebarClose" id="sidebarClose" className="hidden peer" />
                <img src="/sidebarOpenCloseButton.png" alt="" className='hidden | rotate-180 md:block cursor-pointer peer-checked:rotate-0' onClick={handleClick} />
              </label>
            </div>

            <div className='p-[0.625rem] rounded-[0.3125rem] hover:bg-[#ECECEc] mb-3 flex gap-3 items-center cursor-pointer'>
              <img src="/sidebarHome.png" alt="" />
              {sidebarActive && (
                <p className='hidden | md:block'>Home</p>
              )}
            </div>

            <div className='p-[0.625rem] rounded-[0.3125rem] hover:bg-[#ECECEc] flex gap-3 items-center cursor-pointer'>
              <img src="/sidebarCalendar.png" alt="" />
              {sidebarActive && (
                <p className='hidden | md:block'>Calendar</p>
              )}
            </div>
          </div>

          <button onClick={() => { handleSignout() }} className='p-[0.625rem] items-center rounded-[0.3125rem] border border-[#646464] hover:bg-[#ECECEc] shadow-[0_4px_33.3px_hsl(0,0%,0%,16%)] flex gap-3 cursor-pointer'>
            <img src="/sidebarPremium.png" alt="" />
            {sidebarActive && (
              <p className='hidden | md:block'>Premium</p>
            )}
          </button>
        </nav>
      </div>

    </>
  );
};

export default Sidebar;
