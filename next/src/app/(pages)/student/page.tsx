import { redirect } from "next/navigation"

export default async function page() {
    console.log("Redirecting to /student/classrooms")
    redirect("/student/classrooms")
  return (
    <></>
  )
}
