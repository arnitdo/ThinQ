import type { Metadata } from "next";
import RoleChecker from "@/components/RoleChecker";

export const metadata: Metadata = {
	title: "ThinQ - Admin",
	description: "ThinQ is a revolutionary web platform for conducting online classes, complete with a vibrant set of features tailored to professionals in education",
};

export default function RootLayout({ children }: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			{children}
			<RoleChecker role={"Administrator"} />
		</>
	);
}
