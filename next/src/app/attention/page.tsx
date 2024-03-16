"use client";

import Head from "next/head";
import dynamic from "next/dynamic";

const FaceLandmarkCanvas = dynamic(
  () => {
    return import("../../components/FaceLandmarkCanvas");
  },
  { ssr: false }
);

const page = () => {
  return (
    <div>
      <div className="flex justify-center w-full">
        <FaceLandmarkCanvas />
      </div>
    </div>
  )
}

export default page
