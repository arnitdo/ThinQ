import React from "react";
import Marquee from "react-fast-marquee";
import Navbar from "../../../components/Navbar";
import Image from "next/image";

const page = () => {
  return (
    <section className="h-[122vh]">
      <Navbar item1="Features" item2="Contact" item3="" specialitem="Log in" />
      <Marquee
        autoFill
        gradient
        direction="right"
        className="opacity-10 text-8xl -z-10 overflow-hidden absolute max-sm:text-6xl select-none font-semibold"
      >
        <div className="border-[0.9rem] border-black rotate-45"></div>
        <div className="mx-4 overflow-hidden">MONITOR</div>
        <div className="border-[0.9rem] border-black rotate-45"></div>
        <div className="mx-4 overflow-hidden">WORK</div>
        <div className="border-[0.9rem] border-black rotate-45"></div>
        <div className="mx-4 overflow-hidden">SLACK</div>
        <div className="border-[0.9rem] border-black rotate-45"></div>
        <div className="mx-4 overflow-hidden">REPEAT</div>
      </Marquee>
      <div className="bluegrad max-sm:-ml-96"></div>
      <div className="pinkgrad "></div>
      <div className="flex w-full max-md:flex-col ">
        <div className=" w-6/12 max-md:w-full items-center justify-center">
          <div className="bg-white rounded-3xl mx-auto max-sm:w-11/12 w-7/12 max-[1185px]:w-10/12 shadow-xl h-fit p-6 m-10 relative | before:absolute before:-inset-[2px] before:bg-gradient-to-br before:from-[#0073D2] before:from-35% before:to-[#E11AA5] before:to-[52%] before:-z-20 before:rounded-[calc(1.5rem+2px)]">
            <div className="font-semibold text-2xl text-center">Login</div>
            <p className="text-gray-500 text-center mt-1 text-md mb-6">
              Just bear with us, its gonna be worth!
            </p>
            <form action="">
              <div className="flex flex-col">
                <label
                  htmlFor="collegeID"
                  className="text-zinc-800 font-semibold mb-1"
                >
                  School/College/Organization ID:
                </label>
                <input
                  type="text"
                  name="collegeID"
                  className="border border-gray-300 rounded-md py-3 p-2 mb-4"
                  placeholder="Pune Institute of Computer Technology ID"
                />
                <label
                  htmlFor="collegeID"
                  className="text-zinc-800 font-semibold mb-1"
                >
                  Username:
                </label>

                <input
                  type="text"
                  className="border border-gray-300 rounded-md py-3 p-2 mb-4"
                  placeholder="Choose a username you won't regret later!"
                />
                <label
                  htmlFor="collegeID"
                  className="text-zinc-800 font-semibold mb-1"
                >
                  Password:
                </label>
                <input
                  type="password"
                  className="border border-gray-300 rounded-md py-3 p-2 mb-4"
                  placeholder="Choose a Strong Password"
                />
                <button className="bg-gradient-to-b from-blue-400 hover:scale-105 transition-all font-bold text-lg to-blue-500 hover:shadow-2xl ease-in-out text-white rounded-md px-2 py-4 mt-4">
                  Log in
                </button>
              </div>
            </form>
          </div>
        </div>
        <div>
          <Image src="/Iphone.png" alt="iphone" width={269.4} height={583} className="absolute -mt-4 max-md:hidden ml-32 max-sm:ml-6 overflow-x-hidden shadowph" />
          <Image src="/Landing 1.png" alt="nothing" height={720} width={1000} className="mt-32 -z-10 absolute overflow-x-hidden max-md:hidden right-0"/></div>
      </div>
    </section>
  );
};

export default page;
