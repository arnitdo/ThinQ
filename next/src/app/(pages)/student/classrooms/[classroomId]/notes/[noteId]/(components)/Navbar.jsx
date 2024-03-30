"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function Navbar() {
    const [nav, setnav] = useState(false)
    useEffect(() => {
      const localPreference = typeof (window) !== "undefined" ? window.localStorage.getItem('prefers-theme') : 'dark';
    if (localPreference) {
      if (localPreference === 'light') 
      document.getElementById('logo').src = '/logoblack.png'
      else 
      document.getElementById('logo').src = '/logowhite.png';
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.getElementById('logo').src = '/logowhite.png'
    }
    }, [])
    
    function toggleTheme() {
        let toggleButton = document.getElementById("toggler")
        if (document.body.classList.contains('dark')) {
            document.getElementById('logo').src = '/logoblack.png'
          document.body.classList.add('fade-in-light');
          document.body.classList.remove('dark');
          document.body.classList.remove('fade-in-dark');
          window.localStorage.setItem('prefers-theme', 'light');
          if (toggleButton) {
            toggleButton.setAttribute('aria-pressed', false);
            toggleButton.setAttribute('aria-label', 'Activate Dark Mode');
          }
        } else {
            document.getElementById('logo').src = '/logowhite.png'
          document.body.classList.add('fade-in-dark');
          document.body.classList.add('dark');
          document.body.classList.remove('fade-in-light');
          window.localStorage.setItem('prefers-theme', 'dark');
          if (toggleButton) {
            toggleButton.setAttribute('aria-pressed', true);
            toggleButton.setAttribute('aria-label', 'Activate Light Mode');
          }
        }
      }
  return (
    <>
    <div className=' flex flex-row w-full md:justify-evenly justify-between  lg:px-0 md:px-0 lg:justify-evenly items-center  '>
        
        <Link className=' hidden lg:block md:block' href={'/'}><img id='logo' src='/logoblack.png' 
         width="140px" style={{ left: "60px", top:"60px"}} alt="nomework">

            </img></Link>
      
    <div className=' hidden lg:flex md:flex' style={{flexDirection: "row", gap: "2vw", justifyContent: "start", alignItems: "center"}}>
        <Link href={'/'} className="navlink">Home</Link>
        <Link href={'/features'} className="navlink">Features</Link>
        <Link href={'/pricing'} className="navlink">Pricing</Link>
        <Link href={'/faq'} className="navlink">FAQ</Link>
        <Link href={'/contact'} className="navlink">Contact</Link>
        </div>

    
        
      <button className={` block md:hidden z-50 rounded-full p-2 ${nav?"fixed -rotate-90":" rotate-0"} transition-all`} onClick={()=>setnav(!nav)}>
      <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30">
<path d="M 3 7 A 1.0001 1.0001 0 1 0 3 9 L 27 9 A 1.0001 1.0001 0 1 0 27 7 L 3 7 z M 3 14 A 1.0001 1.0001 0 1 0 3 16 L 27 16 A 1.0001 1.0001 0 1 0 27 14 L 3 14 z M 3 21 A 1.0001 1.0001 0 1 0 3 23 L 27 23 A 1.0001 1.0001 0 1 0 27 21 L 3 21 z"></path>
</svg>
      </button>
      <div className={`lg:hidden flex md:hidden justify-evenly ${nav?"":"-translate-y-full"} transition-all items-center flex-col h-screen w-full fixed bottom-0 left-0 z-40`} style={{backgroundImage:"var(--background-primary)", transitionDuration:"1.5s"}}>
        <Link onClick={()=>{setnav(false)}} href={'/'} className="navlink">Home</Link>
        <Link onClick={()=>{setnav(false)}} href={'/features'} className="navlink">Features</Link>
        <Link onClick={()=>{setnav(false)}} href={'/pricing'} className="navlink">Pricing</Link>
        <Link onClick={()=>{setnav(false)}} href={'/faq'} className="navlink">FAQ</Link>
        <Link onClick={()=>{setnav(false)}} href={'/contact'} className="navlink">Contact</Link>
        </div>

        <button
        aria-label="Activate Dark Mode"
        id='toggler'
        title="Toggle Dark Mode"
        // aria-pressed="false"
        onClick={()=>toggleTheme()}
        className={`dark-mode-toggle z-10 ${nav?" opacity-0 md:opacity-100":" opacity-100"} transition-all}`}
      >
        <span className="sun">
          <img
            alt="sun icon that represents light mode"
            width="35px"
            src="/images/sun.svg"
        /></span>
        <span className="moon"
          ><img
            alt="moon icon to represent dark mode "
            width="25px"
            src="/images/moon.svg"
        /></span>
      </button>
      </div>
      {/* <hr className=' my-5 mx-80'/> */}
      </>
  )
}
