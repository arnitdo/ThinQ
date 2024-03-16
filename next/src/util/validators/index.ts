import type {MaamRequest} from "@/util/api/api_meta";

export type ClientValidatorFunction<DataT> = (
	(() => (Promise<boolean> | boolean)) |
	((value: DataT) => (Promise<boolean> | boolean))
)

export type ClientValidator<DataT extends {} = {}> = {
	[dataKey in keyof DataT]?: ClientValidatorFunction<DataT[dataKey]>
}

export async function applyClientValidation<ObjectT extends {} = {}>(targetObj: ObjectT, objValidators: ClientValidator<ObjectT>): Promise<(keyof ObjectT)[]>{
	const validatorKeys = Object.keys(objValidators) as (keyof ObjectT)[]
	const validationResults = await Promise.all(
		validatorKeys.map(async (validatorKey) => {
			const objectValue = targetObj[validatorKey]
			const validatorFunction = objValidators[validatorKey]!
			const validationResult = await validatorFunction(objectValue)
			if (validationResult){
				return undefined
			}
			return validatorKey
		})
	)

	const filteredValidationResults = validationResults.filter((valResult) => {
		return valResult !== undefined
	}) as (keyof ObjectT)[]

	return filteredValidationResults
}

export type SharedValidatorFunction<DataT> = (
	(() => (Promise<boolean> | boolean)) |
	((value: DataT) => (Promise<boolean> | boolean))
)

export type SharedValidator<DataT extends {} = {}> = {
	[dataKey in keyof DataT]?: SharedValidatorFunction<DataT[dataKey]>
}

export async function applySharedValidation<ObjectT extends {} = {}>(targetObj: ObjectT, objValidators: SharedValidator<ObjectT>): Promise<(keyof ObjectT)[]>{
	const validatorKeys = Object.keys(objValidators) as (keyof ObjectT)[]
	const validationResults = await Promise.all(
		validatorKeys.map(async (validatorKey) => {
			const objectValue = targetObj[validatorKey]
			const validatorFunction = objValidators[validatorKey]!
			const validationResult = await validatorFunction(objectValue)
			if (validationResult){
				return undefined
			}
			return validatorKey
		})
	)

	const filteredValidationResults = validationResults.filter((valResult) => {
		return valResult !== undefined
	}) as (keyof ObjectT)[]

	return filteredValidationResults
}

export type ServerValidatorFunction<DataT, ParamsT extends {} = {}, BodyT extends {} = {}, QueryT extends {} = {}> = (
	(() => (Promise<boolean> | boolean)) |
	((value: DataT) => (Promise<boolean> | boolean)) |
	((value: DataT, req: MaamRequest<ParamsT, BodyT, QueryT>) => (Promise<boolean> | boolean))
	)

export type ServerValidator<DataT extends {} = {}, ParamsT extends {} = {}, BodyT extends {} = {}, QueryT extends {} = {}> = {
	[dataKey in keyof DataT]?: ServerValidatorFunction<DataT[dataKey], ParamsT, BodyT, QueryT>
}

export async function applyServerValidation<ObjectT extends {} = {}, ParamsT extends {} = {}, BodyT extends {} = {}, QueryT extends {} = {}>(targetObj: ObjectT, serverReq: MaamRequest<ParamsT, BodyT, QueryT>, objValidators: ServerValidator<ObjectT>): Promise<(keyof ObjectT)[]>{
	const validatorKeys = Object.keys(objValidators) as (keyof ObjectT)[]
	const validationResults = await Promise.all(
		validatorKeys.map(async (validatorKey) => {
			const objectValue = targetObj[validatorKey]
			const validatorFunction = objValidators[validatorKey]!
			const validationResult = await validatorFunction(objectValue, serverReq)
			if (validationResult){
				return undefined
			}
			return validatorKey
		})
	)

	const filteredValidationResults = validationResults.filter((valResult) => {
		return valResult !== undefined
	}) as (keyof ObjectT)[]

	return filteredValidationResults
}