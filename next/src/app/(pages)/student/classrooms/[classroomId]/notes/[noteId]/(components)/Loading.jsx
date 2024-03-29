"use client"
import React, { useEffect, useState } from 'react'

export default function Loading() {
  const funnyLoadingSentences = [
    "Generating brilliance... or at least attempting to!",
    "Loading... faster than a caffeinated sloth on rollerblades.",
    "Hold tight! Converting thoughts into pixels... with style.",
    "Cooking up words and mischief. Please wait.",
    "Loading awesomeness... Disclaimer: May contain traces of wit.",
    "Shhh... the website is whispering sweet nothings to Gemini AI.",
    "Spinning wheels and weaving words. Patience, my friend.",
    "Loading like it's 1999. But with better fonts.",
    "Creating magic in the digital cauldron. Almost there!",
    "Hold on tight! Your masterpiece is about to materialize."
  ];
  const randomIndex = Math.floor(Math.random() * funnyLoadingSentences.length);
  const [randomString, setRandomString] = useState(funnyLoadingSentences[randomIndex]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * funnyLoadingSentences.length);
      setRandomString(funnyLoadingSentences[randomIndex]);
    }, 5000);

    // Cleanup the interval to avoid memory leaks
    return () => clearInterval(intervalId);
  }, [funnyLoadingSentences]);

  return (
    <div id="loading" style={{display: "none",flexDirection:"column",gap:"50px", width: "100%", justifyContent: "center", alignItems: "center", minHeight: "100vh"}}>
      <div className="lds-grid" ><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      <h1 className=' text-lg w-full text-center '>{randomString}</h1>
    </div>
  )
}
