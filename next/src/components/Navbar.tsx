"use client";
import React, {useState} from "react";
import "../app/globals.css";
import {motion} from "framer-motion";
import Link from "next/link";

const Navbar = ({item1, item2, item3, specialitem}: {item1: any, item2: any, item3: any, specialitem: any}) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const handleClick = () => {
    setIsNavOpen(!isNavOpen);
  };
  return (
    <div className="px-10 max-sm:px-4">
      <div className="w-full bg-white border border-[#8C8C8C] rounded-3xl p-4 mt-6 flex justify-between items-center shadow-xl mb-4">
        <Link href="/">
          <img src="/thinQ_black.png" alt="" />
        </Link>
        <div className="flex space-x-6 items-center max-md:hidden">
          <Link href="" className="text-[#3D4242]">
            {item1}
          </Link>
          <Link href="" className="text-[#3D4242]">
            {item2}
          </Link>
          {item3 && <Link href="" className="text-[#3D4242]">
            {item3}
          </Link>}
          <Link
            href="/login"
            className="text-white bg-[#3D4242] rounded-full px-4 py-2"
          >
            {specialitem}
          </Link>
        </div>
        
      <div className="md:hidden" onClick={handleClick}>
            {isNavOpen ? (
                  <img src="/cross.png" alt="" className="invert opacity-60" />
                ) : (
                  <img src="/grid.png" alt="" className="invert opacity-60" />
                )}
        </div>
        {isNavOpen && (
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 180 }}
                exit={{ opacity: 0 }}
                className="md:hidden bg-black backdrop-blur-md z-10 bg-opacity-70 absolute w-[91.333333%] rounded-xl max-[438px]:-ml-2 h-fit"
              >
                <div className="text-center text-white p-6 text-md">{item1}</div>{" "}
                <div className="text-center p-6 text-white text-md">{item2}</div>
                <div className="">{item3}</div>

                <div className="text-center p-6 text-white text-md">
                  <div className="px-16 text-black font-semibold bg-white py-2 rounded-full border w-fit mx-auto">
                    <a href="/login">{specialitem}</a>
                  </div>
                </div>
              </motion.div>
            )}
      </div>
    </div>
  );
};

export default Navbar;
