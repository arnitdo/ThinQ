"use client"

import ClassroomHeader from "@/components/ClassroomHeader";

export default function RootLayout({params:{classroomId},children}: Readonly<{
    params: {classroomId:string};
	children: React.ReactNode;
}>) {
	return (
		<>
            <ClassroomHeader classroomId={classroomId}/>
            {children}
		</>
	);
}
