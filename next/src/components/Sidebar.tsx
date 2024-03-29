"use client";
import React, { useState } from "react";
import { logout } from "@/util/client/helpers";
import useAuthStore from "@/lib/zustand";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { roleRoute } from "./AuthChecker";
const Sidebar = ({
  item1,
  item2,
  item3,
}: {
  item1: any;
  item2: any;
  item3: any;
}) => {
  const [sidebarActive, setSidebarActive] = useState(true);
  const { signout, user } = useAuthStore();

  const router = useRouter();

  const handleClick = () => {
    setSidebarActive(!sidebarActive);
  };
  async function handleSignout() {
    const response = await logout();
    if (response) {
      router.push("/login");
      signout();
    }
  }

  return user ? (
    <>
      <div className="leftWrapper | h-full">
        <nav className="sideBar | max-sm:p-1  p-[1.125rem] border border-[#8C8C8C] rounded-[0.5rem] h-[96vh] flex flex-col justify-between sticky top-4 md:w-[248px] has-[:checked]:w-auto">
          <div>
            <div className="mb-5 flex justify-between items-center | has-[:checked]:flex-col has-[:checked]:items-center has-[:checked]:gap-3">
              <Link href="/" className="md:hidden">
                <img
                  src="/sidebarMobileLogo.png"
                  alt=""
                  className={`w-[calc(100%_-_0.5rem)] mx-auto mt-2`}
                />
              </Link>
              {sidebarActive ? (
                <Link href="/">
                  <img
                    src="/bigblack.png"
                    alt=""
                    className={`hidden | md:block max-w-20`}
                  />
                </Link>
              ) : (
                <Link href="/">
                  <img
                    src="/sidebarMobileLogo.png"
                    alt=""
                    className={`hidden | md:block max-w-20`}
                  />{" "}
                </Link>
              )}

              <label htmlFor="sidebarClose" className="hidden | md:block">
                <input
                  type="checkbox"
                  name="sidebarClose"
                  id="sidebarClose"
                  className="hidden peer"
                />
                <img
                  src="/sidebarOpenCloseButton.svg"
                  alt=""
                  className="hidden | rotate-0 md:block cursor-pointer peer-checked:rotate-180"
                  onClick={handleClick}
                />
              </label>
            </div>

            <Link
              href={`${user ? roleRoute[user.userType] + "/classrooms" : "/"}`}
              className="p-[0.625rem] rounded-[0.3125rem] hover:bg-[#ECECEc] mb-3 flex gap-3 items-center cursor-pointer"
            >
              <img
                src="/sidebarHome.svg"
                alt=""
                className="w-[min(100%,26px)]"
              />
              {sidebarActive && <p className="hidden | md:block">{item1}</p>}
            </Link>

            {user.userType === "Administrator" ? (
              <Link
                href={`${user ? roleRoute[user.userType] + "/dashboard" : "/"}`}
                className="p-[0.625rem] rounded-[0.3125rem] hover:bg-[#ECECEc] mb-3 flex gap-3 items-center cursor-pointer"
              >
                <img
                  src="/dashboard.svg"
                  alt=""
                  className="w-[min(100%,26px)]"
                />
                {sidebarActive && (
                  <p className="hidden | md:block">{"Dashboard"}</p>
                )}
              </Link>
            ) : (
              <Link
                href={`${user ? roleRoute[user.userType] + "/calender" : "/"}`}
                className="p-[0.625rem] rounded-[0.3125rem] hover:bg-[#ECECEc] mb-3 flex gap-3 items-center cursor-pointer"
              >
                <img
                  src="/sidebarCalendar.svg"
                  alt=""
                  className="w-[min(100%,26px)]"
                />
                {sidebarActive && <p className="hidden | md:block">{item2}</p>}
              </Link>
            )}
            {user.userType === "Teacher" && (
              <Link
                href={`${user ? roleRoute[user.userType] + "/calender" : "/"}`}
                className="p-[0.625rem] rounded-[0.3125rem] hover:bg-[#ECECEc] mb-3 flex gap-3 items-center cursor-pointer"
              >
                <img
                  src="/dashboard.svg"
                  alt=""
                  className="w-[min(100%,26px)]"
                />
                {sidebarActive && <p className="hidden | md:block">{item3}</p>}
              </Link>
            )}
          </div>

          <button
            onClick={() => {
              handleSignout();
            }}
            className="p-[0.625rem] items-center rounded-[0.3125rem] border border-[#646464] hover:bg-[#ECECEc] shadow-[0_4px_33.3px_hsl(0,0%,0%,16%)] flex gap-3 cursor-pointer"
          >
            <img src="/logout.svg" alt="" className="opacity-55" />
            {sidebarActive && <p className="hidden | md:block">Logout</p>}
          </button>
        </nav>
      </div>
    </>
  ) : (
    <></>
  );
};

export default Sidebar;
