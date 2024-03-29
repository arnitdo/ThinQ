import "../globals.css";
import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import HelloHeader from "@/components/HelloHeader";

export const metadata: Metadata = {
    title: "ThinQ",
    description: "ThinQ is a revolutionary web platform for conducting online classes, complete with a vibrant set of features tailored to professionals in education",
};

export default function RootLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className='py-4 px-5 relative h-full'>
                <div
                    className='gridWrapper | text-[#6C6C6C] grid grid-cols-[auto_1fr] gap-3 h-full'>
                    <Sidebar item1={"Home"} item2={"Calender"} item3={"Dashboard"} />

                    <div className='rightWrapper |'>
                        <HelloHeader />
                        {children}

                    </div>
                </div>
            </div>
        </>
    );
}