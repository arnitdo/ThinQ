"use client";
import { useState } from "react";
import "./globals.css";
 
export default function Home() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const handleClick = () => {
    setIsNavOpen(!isNavOpen);
  };
  return (
    <main>
      <section className="hero p-[28px] max-sm:px-4 font-spaceG">
        <div className="grid gap-7 auto-cols-fr auto-rows-[auto]">
          <div className="text-white p-[24px] rounded-3xl bg-gradient-to-b from-[#42A9FD] to-[#286597] to-[76%] lg:col-span-2 lg:row-span-4 lg:bg-[url(/vrNigga.png),linear-gradient(-25deg,#CBCBCB_15.5%,transparent_16%),linear-gradient(#42A9FD,#286597_76%)] lg:bg-no-repeat lg:bg-[90%_100%]">
            <div className="justify-between flex">
              <div>
                <a href="#">
                  <img src="/thinQ.png" alt="" />
                </a>
              </div>
              <div className="md:hidden" onClick={handleClick}>
                <img src="/grid.png" alt="" />
              </div>
            </div>
            {isNavOpen && (
              <div className="md:hidden bg-black backdrop-blur-md bg-opacity-60 absolute w-10/12 rounded-xl h-fit">
                <div className="text-center p-6 text-md">Features</div>{" "}
                <div className="text-center p-6 text-md">Contact</div>
                <div className="text-center p-6 text-md">
                  <div className="px-16 text-black font-semibold bg-white py-2 rounded-full border w-fit mx-auto">
                    Sign In
                  </div>
                </div>
              </div>
            )}
            <button className="text-MD px-[1.4em] py-[0.35em] outline outline-1 rounded-[53px] mb-5 mt-9">
              Join us Now!
            </button>
            <h1 className="text-[3.125rem] sm:text-XXXL font-bold leading-none pb-4">
              Bored of same old Teaching Methods?
              <span className="block w-fit bg-gradient-to-r from-[#EBDD09] to-[#FF54CC] bg-clip-text text-transparent">
                Try ThinQ
              </span>
            </h1>
            <p className="text-[hsl(0,0%,100%,83%)] mb-5">
              Not your Ordinary Classroom, but classroom with Superpowers
            </p>
            <button className="bg-white text-[#276597] px-[1.25em] py-[0.625em] rounded-[2.5em] hover:bg-transparent hover:text-white hover:border transition-all ease-in-out delay-75">
              Get Started
            </button>
          </div>

          <div className="text-white p-[24px] rounded-3xl bg-secondary relative isolate overflow-clip lg:col-start-3 lg:col-span-2 lg:row-start-1 lg:row-span-2">
            <nav className="max-md:hidden flex justify-end items-center gap-6 max-sm:hidden">
              <a href="">Features</a>
              <a href="">Contact</a>
              <button className="bg-white text-black px-[1.25em] py-[0.625em] rounded-[1.625em]">
                Sign in
              </button>
            </nav>
            <p className="text-[2.39rem] sm:text-6xl font-bold mt-6">
              Monitor, Work, Slack Repeat
            </p>
            <img
              src="/studentTired.png"
              alt=""
              className="mt-14 max-sm:mx-auto max-sm:scale-125"
            />
            <span className="text-[hsl(0,0%,100%,30%)] font-bold scale-[6000%] absolute top-[35%] left-[50%] rotate-[61deg] -z-10 select-none">
              +
            </span>
          </div>

          <div className="text-white p-[12px] rounded-3xl bg-gradient-to-b from-[#AEAEAE] to-[#CACACA] shadow-[0_0_14px_hsl(0,0%,0%,25%)_inset] grid grid-cols-[repeat(auto-fit,minmax(92px,1fr))] place-items-center gap-[12px]">
            <a href="" className="grid rounded-xl overflow-clip">
              <img
                src="/varad.png"
                alt=""
                className="col-span-full row-span-full"
              />
              <p className="col-span-full row-span-full justify-self-center self-end">
                Varad
              </p>
            </a>
            <a href="" className="grid rounded-xl overflow-clip">
              <img
                src="/arnav.png"
                alt=""
                className="col-span-full row-span-full"
              />
              <p className="col-span-full row-span-full justify-self-center self-end">
                Arnav
              </p>
            </a>
            <a href="" className="grid rounded-xl overflow-clip">
              <img
                src="/mihir.png"
                alt=""
                className="col-span-full row-span-full"
              />
              <p className="col-span-full row-span-full justify-self-center self-end">
                Mihir
              </p>
            </a>
            <a href="" className="grid rounded-xl overflow-clip">
              <img
                src="/prinkal.png"
                alt=""
                className="col-span-full row-span-full"
              />
              <p className="col-span-full row-span-full justify-self-center self-end">
                Prinkal
              </p>
            </a>
            <a href="" className="grid rounded-xl overflow-clip">
              <img
                src="/rishabh.png"
                alt=""
                className="col-span-full row-span-full"
              />
              <p className="col-span-full row-span-full justify-self-center self-end">
                Rishabh
              </p>
            </a>
            <a href="" className="grid rounded-xl overflow-clip">
              <img
                src="/milind.png"
                alt=""
                className="col-span-full row-span-full"
              />
              <p className="col-span-full row-span-full justify-self-center self-end">
                Milind
              </p>
            </a>
          </div>

          <div className="text-white p-[24px] rounded-3xl bg-gradient-to-b from-[#EDDE09] to-[#B6AA0B] lg:col-start-4 lg:row-start-2 lg:row-span-2 lg:relative lg:z-10"></div>

          <div className="text-white p-[24px] rounded-3xl bg-gradient-to-b from-[#565656] to-[#313131] lg:col-span-2"></div>
        </div>
      </section>
    </main>
  );
}
