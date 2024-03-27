"use client"
import { useInView } from 'framer-motion';
import React, { useEffect } from 'react'
import { motion } from "framer-motion"


export default function Landing() {
  function scrollToDiv(elementId) {
    var element = document.getElementById(elementId);
    element.scrollIntoView({ behavior: 'smooth' });
  }
  function increaseWaves(scale) {
    const waveElements = document.getElementsByClassName("waves");
    const waveArray = Array.from(waveElements);
    waveArray.forEach((element) => {
      element.style.transform = `scaleY(${scale}) scaleX(${scale + 0.8})`
    })
  }
  const landingRef = React.useRef(null);
  const isLandingVisible = useInView(landingRef);

  useEffect(() => {
    increaseWaves(0.6)
  }, [isLandingVisible])

  return (
    <section ref={landingRef} id='landing' style={{ minHeight: "100vh", display: "flex", justifyContent: "start", alignItems: "center", flexDirection: "column", height: "100%", position: "relative" }}>

      <div className='logoText scale-90 lg:scale-100 md:scale-100 relative ' style={{
        fontSize: "3rem", textAlign: "center",
        //  backgroundImage: "linear-gradient(to right, #21D4FD, #B721FF)",
        paddingTop: "10vh",
        color: "transparent",
        marginTop: "5vh",
        marginBottom: "5vh"
      }}><h1 style={{
        backgroundImage: "linear-gradient(to right, #21D4FD, #B721FF)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text", mixBlendMode: "difference", zIndex: "10"
      }}>NOMEWORK</h1>
        <motion.div className=' top-10 md:top-0 bottom-0 left-0 right-0 mr-auto ml-auto'
        initial={{y:-50}}
        animate={{ y:-25 }}
        transition={{ repeat: Infinity, repeatType:"reverse", duration: 3 }}
          style={{
            borderRadius: "100%", width: "300px", height: "300px", position: "absolute", zIndex: "-15",
            backgroundImage: "linear-gradient(to right, #b3ffab 0%, #12fff7 100%)",
          }}></motion.div></div>
      <div className=' px-5 py-4 w-full md:w-10/12 lg:w-9/12 relative' style={{
        color: "rgb(255, 255, 255)", borderRadius: "10px", borderWidth: "10px", border: "transparent",
        backgroundImage: "var(--promptField-bg)", display: "flex", flexDirection: "row", gap: "1vw", justifyContent: "center", alignItems: "center", marginTop: "2rem", fontSize: "medium", maxWidth: "80%", borderColor: "transparent"
      }}>
        <div contenteditable="true" id="promptField" style={{ width: "100%", height: "100%", outline: "none", color: "var(--primary-button-color)" }}></div>
        <svg onClick={() => {
          document.getElementById('inputs').style.display = 'flex';
          scrollToDiv("inputs");
          increaseWaves(0.9)
        }} xmlns="http://www.w3.org/2000/svg"
          id="scrollButton" fill="#fff" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
          <path d="M 2 3 L 2 10.5 L 17 12 L 2 13.5 L 2 21 L 22 12 L 2 3 z"></path>
        </svg>
        {/* <div className={` w-screen min-h-[20vh] -z-10 absolute top-0 `} style={{backgroundImage:"var(--background-primary)"}}></div> */}
      </div>
      <p className=' text-xs md:text-base lg:text-lg w-11/12 md:w-10/12 lg:w-9/12' style={{ textAlign: "center", marginTop: "2rem" }}>Whether you&apos;re a kid, teenager, or adult, craft assignments effortlessly and download them as individual images or a complete PDF. Unleash your creativity and enhance your writing experience with <b>Nomework</b>!</p>
      {/* <!-- <div style="textAlign: center; marginTop: 2rem;">
                <a href="https://saurabhdaware.github.io/text-to-handwriting" style="padding: 1rem 2rem; backgroundColor: #fff; color: #000; border-radius: 5px; fontSize: 1.5rem; text-decoration: none;">Go to Text to Handwriting</a>
            </div> --> */}
      <div className=' h-full flex flex-col justify-center items-center w-full lg:hidden md:hidden '>
        <motion.img initial={{y:50}}
        animate={{ y:25 }}
        transition={{ repeat: Infinity, repeatType:"reverse", duration: 3 }} src="/landing.png" alt="" className=' w-4/5 mt-5' />
      </div>
      <button onClick={() => { scrollToDiv('landing') }} className={` ${isLandingVisible ? "hidden" : ""} fixed bottom-10 right-10 p-2 text-xl shadow-md shadow-slate-900 rounded-full`} style={{ backgroundColor: "var(--primary-button-color)", color: "var(--primary-button-text-color)" }}>
        <svg xmlns="http://www.w3.org/2000/svg" className=' rotate-90' x="0px" fill='currentColor' y="0px" width="50" height="50" viewBox="0 0 50 50">
          <path d="M 25 2 C 12.308594 2 2 12.308594 2 25 C 2 37.691406 12.308594 48 25 48 C 37.691406 48 48 37.691406 48 25 C 48 12.308594 37.691406 2 25 2 Z M 25 4 C 36.609375 4 46 13.390625 46 25 C 46 36.609375 36.609375 46 25 46 C 13.390625 46 4 36.609375 4 25 C 4 13.390625 13.390625 4 25 4 Z M 27.875 14 C 27.652344 14.023438 27.441406 14.125 27.28125 14.28125 L 17.28125 24.28125 C 17.085938 24.46875 16.976563 24.730469 16.976563 25 C 16.976563 25.269531 17.085938 25.53125 17.28125 25.71875 L 27.28125 35.71875 C 27.679688 36.117188 28.320313 36.117188 28.71875 35.71875 C 29.117188 35.320313 29.117188 34.679688 28.71875 34.28125 L 19.4375 25 L 28.71875 15.71875 C 29.042969 15.417969 29.128906 14.941406 28.933594 14.546875 C 28.742188 14.148438 28.308594 13.929688 27.875 14 Z"></path>
        </svg>
      </button>
    </section>
  )
}
