"use client"
export default function Page({params: {classroomId}}: {params: {classroomId: string}}) {
  
  return (
    <div>{classroomId}</div>
  )
}
