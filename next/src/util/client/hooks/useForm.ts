"use client"
import {applyClientValidation, ClientValidator} from "@/util/validators";
import {ChangeEventHandler, useState} from "react";

type InputType = "number" | "text" | "email" | "password"

type FormInput<InputDataT> = {
	initialValue: InputDataT,
	inputType: InputType
}

type BeforeSubmit<FormDataT extends {} = {}> = (data: FormDataT) => boolean

type ValueChangeListener<FormDataT> = (inputName: keyof FormDataT, inputValue: FormDataT[keyof FormDataT]) => void

type CustomValidationMessages<FormDataT extends {} = {}> = {
	[key in keyof FormDataT]?: string
}

type NameBinding<FormDataT extends {} = {}> = {
	[inputKey in keyof FormDataT]: string
}

type UseFormArgs<FormDataT extends {} = {}> = {
	formValidator: ClientValidator<FormDataT>,
	formInputs: {
		[inputKey in keyof FormDataT]: FormInput<FormDataT[inputKey]>
	},
	nameBinding?: NameBinding<FormDataT>,
	messageBinding?: CustomValidationMessages<FormDataT>
	valueChangeListener?: ValueChangeListener<FormDataT>
}

type FormControls<DataT> = {
	type: InputType
	onChange: ChangeEventHandler<HTMLInputElement>
 	value: DataT
}

type ValidationErrors<FormDataT extends {} = {}> = {
	[inputKey in keyof FormDataT]?: string
}
type UseFormRet<FormDataT extends {} = {}> = {
	formValues: FormDataT,
	formControls: {
		[inputKey in keyof FormDataT]: FormControls<FormDataT[inputKey]>
	},
	setAllFormValues: (formValues: FormDataT) => void,
	setFormInputValue: (inputName: keyof FormDataT, inputValue: FormDataT[keyof FormDataT]) => void,
	clearForm: () => void,
	validationErrors: ValidationErrors<FormDataT>,
	// setValidationError: (inputName: keyof FormDataT, errorMessage: string) => void
	// clearValidationError: (inputName: keyof FormDataT) => void
}

type InputTypeMapping<FormDataT extends {} = {}> = {
	[key in keyof FormDataT]: InputType
}

export function useForm<FormDataT extends {} = {}>(args: UseFormArgs<FormDataT>): UseFormRet<FormDataT> {
	const {formValidator, formInputs, messageBinding, valueChangeListener, nameBinding} = args

	const formInputKeys = Object.keys(formInputs) as (keyof FormDataT)[]

	let resolvedNameBinding = nameBinding
	if (resolvedNameBinding === undefined){
		resolvedNameBinding = Object.fromEntries(
			Object.entries(formValidator).map((formEntry) => {
				const formName = formEntry[0]
				return [formName, formName]
			})
		) as NameBinding<FormDataT>
	}

	const mappedFormDefaultValues = {} as FormDataT
	const mappedFormInputTypes = {} as InputTypeMapping<FormDataT>
	for (const formInputKey of formInputKeys){
		const formInputValue = formInputs[formInputKey]
		mappedFormInputTypes[formInputKey] = formInputValue.inputType
		mappedFormDefaultValues[formInputKey] = formInputValue.initialValue

	}


	const [formInputData, setFormInputData] = useState<FormDataT>(mappedFormDefaultValues)

	const setAllFormValues = (formValues: FormDataT) => {
		setFormInputData(formValues)
	}

	const setFormInputValue = (inputName: keyof FormDataT, inputValue: FormDataT[keyof FormDataT]) => {
		setFormInputData((prevData) => {
			return {
				...prevData,
				[inputName]: inputValue
			}
		})
	}

	const clearForm = () => {
		setFormInputData(mappedFormDefaultValues)
	}

	const validationErrors: ValidationErrors<FormDataT> = {}

	const validationResult = applyClientValidation(formInputData, formValidator)
	for (const validationResultKey of validationResult){
		validationErrors[validationResultKey] = messageBinding ?
			messageBinding[validationResultKey] ?
				messageBinding[validationResultKey] :
				`Invalid ${resolvedNameBinding[validationResultKey]}`
			: `Invalid ${resolvedNameBinding[validationResultKey]}`
	}

	const formControlEntries = formInputKeys.map((inputKeyName) => {
		return [inputKeyName, {
			value: formInputData[inputKeyName],
			type: mappedFormInputTypes[inputKeyName] as InputType,
			onChange: ((e: { target: { value: string; }; }) => {
				const mappedInputType = mappedFormInputTypes[inputKeyName] as InputType
				if (mappedInputType === "number"){
					const parsedValue = Number.parseFloat(e.target.value)
					if (valueChangeListener) {
						// @ts-ignore
						valueChangeListener(inputKeyName, parsedValue)
					}
					setFormInputData((prevData) => {
						return {
							...prevData,
							[inputKeyName]: parsedValue
						}
					})
				} else {
					if (valueChangeListener) {
						// @ts-ignore
						valueChangeListener(inputKeyName, e.target.value)
					}
					setFormInputData((prevData) => {
						return {
							...prevData,
							[inputKeyName]: e.target.value
						}
					})
				}
			}) satisfies ChangeEventHandler<HTMLInputElement>
		}]
	})

	const formControls = Object.fromEntries(formControlEntries)

	return {
		formControls: formControls,
		formValues: formInputData,
		setFormInputValue: setFormInputValue,
		setAllFormValues: setAllFormValues,
		clearForm: clearForm,
		validationErrors: validationErrors,
		// setValidationError: setValidationError,
		// clearValidationError: clearValidationError,
	}
}