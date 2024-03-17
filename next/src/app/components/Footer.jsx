import React from "react";

const Footer = () => {
  return (
    <>
      <div className="p-6 border mt-4 border-gray-600 mx-auto flex items-center justify-center bg-white bottom-0">
        <div className="flex items-center justify-center">
          <img src="/bigblack.png" alt="" height={49} width={99.79} />
          <div className="mx-4">© 2024 MaamCoders</div>
        </div>
        <div className="text-gray-500 flex gap-6">
          <a href="/" className=" space-x-2">
            Home
          </a>
          <a href="/login"> Login</a>
        </div>
      </div>
    </>
  );
};

export default Footer;
