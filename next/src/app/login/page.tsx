import React from "react";
import Marquee from "react-fast-marquee";
import Navbar from "../components/Navbar";
const page = () => {
  return (
    <section className="h-screen">
      <Navbar item1="Features" item2="Contact" item3="" specialitem="Log in" />
      <Marquee
        autoFill
        gradient
        direction="right"
        className="opacity-10 text-8xl -z-10 overflow-hidden absolute max-sm:text-6xl select-none font-semibold"
      >
        <img src="/diamond.png" alt="" />
        <div className="mx-4">MONITOR</div>
        <img src="/diamond.png" alt="" />
        <div className="mx-4">WORK</div>
        <img src="/diamond.png" alt="" />
        <div className="mx-4">SLACK</div>
        <img src="/diamond.png" alt="" />
        <div className="mx-4">REPEAT</div>
      </Marquee>
      <div className="flex w-full max-md:flex-col">
        <div className=" w-6/12 max-md:w-full items-center justify-center">
          <div className="bg-white rounded-3xl mx-auto max-sm:w-11/12 z-10 w-7/12 max-[1185px]:w-10/12 shadow-xl h-fit p-6 border-rose-600 border m-10">
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
                <button className="bg-gradient-to-b from-blue-400 hover:scale-105 transition-all to-blue-500 hover:shadow-2xl ease-in-out text-white rounded-md px-2 py-4 mt-4">
                  Log in
                </button>
              </div>
            </form>
          </div>
        </div>
        <div>Hello</div>
      </div>
    </section>
  );
};

export default page;
