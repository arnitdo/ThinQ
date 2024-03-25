import {DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3"
import {S3ObjectMethod} from "@/util/s3/types";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {S3Object} from "@prisma/client";
import db from "@/util/db";

const s3Client = new S3Client({
	region: process.env.AWS_S3_REGION!,
	credentials: {
		accessKeyId: process.env.AWS_S3_KEY_ID!,
		secretAccessKey: process.env.AWS_S3_KEY_SECRET!
	}
})

const requestCommandMap = {
	GET: GetObjectCommand,
	PUT: PutObjectCommand,
	DELETE: DeleteObjectCommand
} as const

type ObjectUrlOpts = {
	requestMethod: S3ObjectMethod
	objectKey: string
}

export async function getObjectUrl({requestMethod, objectKey}: ObjectUrlOpts): Promise<string> {
	const assocMethodCommand = requestCommandMap[requestMethod]

	// @ts-ignore
	const objCommand = new assocMethodCommand({
		Bucket: process.env.AWS_S3_BUCKET!,
		Key: objectKey
	})

	const presignedUrl = await getSignedUrl(
		s3Client,
		objCommand,
		{
			expiresIn: 600		// 10min for PUT / DELETE
		}
	)

	if (requestMethod === "GET") {
		// Strip authentication for GET requests
		const objectUrl = new URL(presignedUrl)
		const {origin: s3Origin, pathname: s3Pathname} = objectUrl
		const resolvedS3Url = `${s3Origin}${s3Pathname}`
		return resolvedS3Url
	}

	return presignedUrl
}

export async function checkIfS3ObjectExists(args: S3Object): Promise<boolean> {
	const objectExists = await db.s3Object.findFirst({
		where: {
			objectKey: args.objectKey
		}
	})

	return objectExists !== null
}

export async function addOrUpdateS3Object(args: S3Object): Promise<S3Object> {
	const upsertedObject = await db.s3Object.upsert({
		create: args,
		update: args,
		where: {
			objectKey: args.objectKey
		}
	})

	return upsertedObject
}

export async function deleteS3ObjFromDB(args: S3Object): Promise<boolean> {
	const deletedObject = await db.s3Object.delete({
		where: {
			objectKey: args.objectKey
		}
	})

	return true
}