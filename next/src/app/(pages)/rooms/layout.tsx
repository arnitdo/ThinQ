import React from "react";

type LayoutProps = {
	children?: React.ReactNode
}

export default function LectureLayout({children}: LayoutProps){
	return (
		<html lang={"en"}>
			<body className={"h-screen w-screen"}>
				{children}
			</body>
		</html>
	)
}