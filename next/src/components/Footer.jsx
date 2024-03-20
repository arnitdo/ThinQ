import Link from "next/link"
import React from "react";

const Footer = () => {
	return (
		<div className="">
			<div
				className="p-6 border mt-4 border-gray-600 mx-auto flex flex-row items-center justify-center footer bottom-0 max-md:flex-col">
				<div className="flex items-center justify-center">
					<img src="/bigblack.png" alt="" height={49} width={99.79}/>
					<div className="mx-4">© 2024 MaamCoders</div>
				</div>
				<div className="text-gray-500 flex gap-6">
					<Link href="/" className=" space-x-2">
						Home
					</Link>
					<Link href={"/auth/login"}> Login </Link>
				</div>
			</div>
		</div>
	);
};

export default Footer;
