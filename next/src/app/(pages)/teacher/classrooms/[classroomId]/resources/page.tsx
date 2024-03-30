"use client"
import NestedNav, {NavLink} from '@/components/NestedNav'
import useAuthStore from '@/lib/zustand'
import {getAllResources, makeAPIRequest} from '@/util/client/helpers'
import {ClassroomResource} from '@prisma/client'
import {useEffect, useState} from 'react'
import {toast} from "sonner";
import {manageMedia} from "@/util/s3/client";
import {CreateClassroomResourceResponse} from "@/util/api/api_responses";
import {
	CreateClassroomResourcesBody,
	CreateClassroomResourcesParams,
	DeleteClassroomResourcesParams
} from "@/util/api/api_requests";
import Dropzone from "react-dropzone";
import {ResponseJSON} from "@/util/api/api_meta";

type ResourceData = Omit<ClassroomResource, "resourceObjectKey"> & {
	resourceUrl: string
}

const ResourceCard = ({item, orgId, onDelete}: { orgId: string, item: ResourceData, onDelete: () => void }) => {
	const deleteResource = async () => {
		const response = await makeAPIRequest<ResponseJSON, DeleteClassroomResourcesParams>({
			requestUrl: "/api/orgs/:orgId/classroom/:classroomId/resource/:resourceId",
			requestMethod: "DELETE",
			urlParams: {
				resourceId: item.resourceId,
				orgId: orgId,
				classroomId: item.classroomId
			},
			bodyParams: {},
			queryParams: {},
		})

		if (response.hasResponse && response.responseData.responseStatus === "SUCCESS"){
			toast.success("Resource deleted successfully!")
			return onDelete()
		}

		toast.error("Something went wrong")
	}

	return (
		<div className='quizCard | rounded-[0.625rem] border border-[#A0A0A0] text-center px-6 py-7'>
			<h1 className='text-xl text-black'>{item.resourceName}</h1>
			<div className='mt-3 flex gap-3 flex-wrap justify-center'>
				<a className='text-sm text-[#0039C6] border border-[#5462DF] bg-[#CCE0FF] font-medium py-[0.375rem] px-3 rounded-full'
				   href={item.resourceUrl} download>Download</a>
				<p className='cursor-pointer text-sm text-[#00802B] border border-[#00B833] bg-[#CCFFE0] font-medium py-[0.375rem] px-3 rounded-full'
				   onClick={() => {
					   navigator.clipboard.writeText(item.resourceUrl)
					   toast.success("Link copied to clipboard!")
				   }}>Share</p>
				<p className='cursor-pointer text-sm text-[#FF5050] border border-[#FF5050] bg-[#FFBABA] font-medium py-[0.375rem] px-3 rounded-full'
				   onClick={() => {
					   deleteResource()
				   }}>Delete</p>

			</div>
		</div>
	)
}

type UploadResourceFormProps = {
	onUpload: (data: ResourceData) => void
	orgId: string
	classId: string
}

function UploadResourceForm(props: UploadResourceFormProps) {
	const {onUpload, classId, orgId} = props

	const onFileUpload = async (files: File[]) => {
		if (files.length){
			const selectedFile = files[0]
			let fileName = selectedFile.name
			fileName = fileName.toLowerCase().replaceAll(/\s/gi, "-")
			const mediaResp = await manageMedia({
				mediaFiles: [selectedFile],
				requestMethod: "PUT",
				objectKeyGenerator: (file) => {
					return `orgs/${orgId}/classrooms/${classId}/resources/${fileName}`
				}
			})
			if (mediaResp.length && mediaResp[0].mediaSuccess){
				const apiResp = await makeAPIRequest<CreateClassroomResourceResponse, CreateClassroomResourcesParams, CreateClassroomResourcesBody>({
					requestUrl: "/api/orgs/:orgId/classroom/:classroomId/resource",
					urlParams: {
						orgId: orgId,
						classroomId: classId
					},
					requestMethod: "POST",
					bodyParams: {
						resourceObjectKey: mediaResp[0].objectKey,
						resourceName: selectedFile.name
					},
					queryParams: {}
				})
				if (apiResp.hasResponse && apiResp.responseData.responseStatus === "SUCCESS"){
					toast.success("File uploaded successfully!")
					const fileUrl = new URL(mediaResp[0].objectUrl)

					onUpload({
						classroomId: classId,
						resourceName: fileName,
						resourceUrl: `${fileUrl.origin}${fileUrl.pathname}`,
						resourceId: apiResp.responseData.resourceId
					})
				}
			}
		}
	}

	return (
		<div className='quizCard | rounded-[0.625rem] border border-[#A0A0A0] text-center'>
			<Dropzone onDrop={acceptedFiles => onFileUpload(acceptedFiles)}>
				{({ getRootProps, getInputProps }) => (
					<div {...getRootProps()}>
						<input {...getInputProps()} />
						<div className=" flex flex-col gap-1 h-full py-6 border border-black border-dashed w-full rounded-xl overflow-clip justify-center items-center">
							<p className=" text-xl font-semibold text-zinc-700">Choose a File</p>
							<p className=" text-xl font-medium text-zinc-500">or</p>
							<p className=" text-xl font-semibold text-zinc-700">Drag to Upload</p>
						</div>
					</div>
				)}
			</Dropzone>
		</div>
	)
}

const Page = ({params: {classroomId}}: { params: { classroomId: string } }) => {


	const {user} = useAuthStore()
	const [data, setData] = useState<ResourceData[]>([]);

	useEffect(() => {
		const getData = async () => {
			if (!user) return;
			const resources = await getAllResources(user.userOrgId, classroomId)
			if (resources) {
				setData(resources)
			}
		}
		getData()
	}, [user])


	const navlinks: NavLink[] = [
		{
			href: `/teacher/classrooms/${classroomId}/lectures`,
			title: "Lectures"
		},
		{
			href: `/teacher/classrooms/${classroomId}/quiz`,
			title: "Quizzes"
		},
		{
			href: `/teacher/classrooms/${classroomId}/notes`,
			title: "Notes"
		},
		{
			href: `/teacher/classrooms/${classroomId}/assessments`,
			title: "Assessments"
		},
		{
			href: `/teacher/classrooms/${classroomId}/resources`,
			title: "Resources"
		}

	]

	return (
		<div className=' flex flex-col gap-2'>
			<NestedNav items={navlinks} button={(<></>)}/>
			<div>
				<h1 className='text-4xl text-black font-medium'>Resources</h1>
				<div className='quizCardWrapper | mt-3 grid gap-10 grid-cols-[repeat(auto-fill,minmax(350px,1fr))]'>
					{user && (
						<UploadResourceForm orgId={user!.userOrgId} classId={classroomId} onUpload={(resData) => {
							setData((prevState) => {
								return [...prevState, resData]
							})
						}} />
					)}
					{data.map((item) => (
						<ResourceCard
							orgId={user!.userOrgId}
							item={item}
							onDelete={() => {
								setData((prevData) => {
									return prevData.filter((prevItem) => {
										return prevItem.resourceId !== item.resourceId
									})
								})
							}}
							key={item.resourceId}
						/>
					))}
				</div>
			</div>
		</div>
)
}

export default Page

