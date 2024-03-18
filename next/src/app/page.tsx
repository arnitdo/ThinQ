"use client";
import { useState } from "react";
import "./globals.css";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Pagination, Autoplay } from "swiper/modules";
import Lottie from "lottie-react";
import animationData from "../../public/animate.json";
import Link from "next/link";
const data = [
  {
    quote:
      "“While creating this i faced 0 errors just like how an orange cat stays calm”",
    author: "Rishabh",
  },
  {
    quote:
      "“Im the Best Developer”",
    author: "Arnav",
  },
  {
    quote:
      "“Pehle kaam phir maam”",
    author: "Varad",
  },
  {
    quote:
      "“Im the CSS King”",
    author: "Milind",
  },
  {
    quote:
      "“I use Nivia Body lotion”",
    author: "Prinkal",
  },
  {
    quote:
      "“Im the Best AIML Guy”",
    author: "Mihir",
  },
];

export default function Home() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const handleClick = () => {
    setIsNavOpen(!isNavOpen);
  };
  return (
    <main>
      <section className="hero p-[28px] max-sm:px-4 font-spaceG">
        <div className="grid gap-7 auto-cols-fr auto-rows-[auto] relative isolate">
          <div className="text-white p-[24px] rounded-3xl bg-gradient-to-b from-[#42A9FD] to-[#286597] to-[76%] lg:col-span-2 lg:row-span-4 lg:bg-[url(/vrNigga.png),linear-gradient(-25deg,#CBCBCB_15.5%,transparent_16%),linear-gradient(#42A9FD,#286597_76%)] lg:bg-no-repeat lg:bg-[90%_100%]">
            <div className="justify-between flex items-center">
              <div>
                <Link href="/">
                  <img src="/thinQ.png" alt="" />
                </Link>
              </div>
              <div className="md:hidden" onClick={handleClick}>
                {isNavOpen ? (
                  <img src="/cross.png" alt="" />
                ) : (
                  <img src="/grid.png" alt="" />
                )}
              </div>
            </div>
            {isNavOpen && (
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="md:hidden bg-black backdrop-blur-md bg-opacity-60 absolute w-[91%] rounded-xl max-[438px]:-ml-2 h-fit"
              >
                <div className="text-center p-6 text-md">Features</div>{" "}
                <div className="text-center p-6 text-md">Contact</div>
                <div className="text-center p-6 text-md">
                  <div className="px-16 text-black font-semibold bg-white py-2 rounded-full border w-fit mx-auto">
                    <a href="/login">Sign In</a>
                  </div>
                </div>
              </motion.div>
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
              <a href="/login"> Get Started</a>
             
            </button>
          </div>

          <div className="text-white p-[24px] rounded-3xl bg-secondary relative isolate overflow-clip lg:z-0 lg:col-start-3 lg:col-span-2 lg:row-start-1 lg:row-span-2">
            <nav className="max-md:hidden flex justify-end items-center gap-6 max-sm:hidden">
              <Link href="">Features</Link>
              <Link href="">Contact</Link>
              <Link href="/login" className="bg-white text-black px-[1.25em] py-[0.625em] rounded-[1.625em] cursor-pointer">
                Sign in
              </Link>
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


          <div className="text-white p-[24px] rounded-3xl bg-gradient-to-b from-[#EDDE09] to-[#B6AA0B] lg:col-start-4 lg:row-start-2 lg:row-span-2 lg:z-20">
            <Lottie animationData={animationData}/>
            <p className="text-white font-bold text-center text-xl">Bridging the gap between the students and the teachers</p>
          </div>

          <div className="text-white p-[24px] max-sm:p-[14] h-fit rounded-3xl bg-gradient-to-b from-[#565656] to-[#313131] lg:col-span-2">
            <Swiper
              modules={[Autoplay, Pagination]}
              
              // pagination={true}
              draggable={true}
              autoplay={{
                delay: 2300,
                disableOnInteraction: false,
              }}
              loop={true}
              spaceBetween={500}
              slidesPerView={1}
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => console.log(swiper)}
              className="h-full w-full mySwiper flex justify-center items-center cursor-grab active:cursor-grabbing"
            >
              {data.map((item, index) => (
                <SwiperSlide key={index} className="mx-auto text-center items-center justify-center my-auto">
                  <div className="text-center text-3xl">{item.quote}</div>{" "}
                  <p className="mt-2 text-gray-400">~ {item.author}</p>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          
          <div className="text-white p-[12px] rounded-3xl bg-gradient-to-b from-[#AEAEAE] to-[#CACACA] shadow-[0_0_14px_hsl(0,0%,0%,25%)_inset] grid grid-cols-[repeat(auto-fit,minmax(92px,1fr))] grid-rows-[auto] place-items-center gap-[12px] lg:row-start-3 lg:col-start-3 @container"> {/*428*/}
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
            <p className="hidden | @[404px]:block @[508px]:row-start-1 @[508px]:col-span-full text-3xl font-[500] col-start-2 row-start-1 col-span-2 text-center">Meet the Team</p>
          </div>
          {/* <div className="text-white p-[24px] rounded-3xl bg-gradient-to-b from-[#565656] to-[#313131] lg:col-span-2"></div> */}
          <div className="ignoreThisDiv gapOverlap hidden | lg:block absolute col-start-4 row-start-2 col-span-1 row-span-1 -inset-[1.75rem] bg-white z-10"></div>
          <div className="ignoreThisDiv invertedBorderRadius hidden | lg:block absolute w-[1.75rem] aspect-square self-end justify-self-end row-start-1 row-span-1 col-start-4 col-span-1 bg-[radial-gradient(circle_at_0_0,#F722B7_1.75rem,white_calc(1.75rem+1px))]"></div>
          <div className="ignoreThisDiv invertedBorderRadius hidden | lg:block absolute w-[1.75rem] aspect-square self-end justify-self-end row-start-1 row-span-1 col-start-3 col-span-1 bg-[radial-gradient(circle_at_0_0,white_1.75rem,#f964cc_calc(1.75rem+1px))] -right-7 -bottom-7 z-10 rotate-180"></div>
          <div className="ignoreThisDiv invertedBorderRadius hidden | lg:block absolute w-[1.75rem] aspect-square self-end justify-self-end row-start-2 row-span-1 col-start-3 col-span-1 bg-[radial-gradient(circle_at_0_0,#F722B7_1.75rem,white_calc(1.75rem+1px))]"></div>
        </div>
      </section>
    </main>
  );
}
