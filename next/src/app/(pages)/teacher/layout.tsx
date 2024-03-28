import type {Metadata} from "next";
import RoleChecker from "@/components/RoleChecker";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
	title: "ThinQ - Admin",
	description: "ThinQ is a revolutionary web platform for conducting online classes, complete with a vibrant set of features tailored to professionals in education",
};

export default function RootLayout({children}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<div className='py-4 px-5 relative h-full'>
				<div
					className='gridWrapper | text-[#6C6C6C] grid grid-cols-[auto_1fr] gap-3 h-full'>
					<Sidebar item1="Home" item2="Calendar" item3="Dashboard"/>

					<div className='rightWrapper |'>
						<header
							className='font-medium p-[1.125rem] max-sm:p-2 border border-[#8C8C8C] rounded-[0.5rem] flex items-center justify-between mb-4 bg-white'>
							<h1 className='text-xl  max-sm:text-lg'>Hello 👋, Teacher</h1>
							<div className='flex gap-6'>
								<div className="ignoreThisDiv line | border"></div>
								<div
									className='grid place-items-center text-black bg-[#D9D9D9] w-[2.0625rem] h-[2.0625rem] aspect-square rounded-[50%]'>R
								</div>
							</div>
						</header>
						{children}
					</div>
				</div>
			</div>
			<RoleChecker role={"Teacher"}/>
		</>
	);
}
