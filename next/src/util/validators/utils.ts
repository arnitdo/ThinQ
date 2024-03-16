import {SharedValidatorFunction} from "."

export enum PARSE_METHOD {
	PARSE_INT,
	PARSE_FLOAT
}

export function EQ<T>(shouldEqual: T){
	return function (value: T){
		return value === shouldEqual
	}
}

/**
 * @description Check that value < 0 or value > 0
 * */
export function NON_ZERO(value: number) {
	return value != 0
}

/**
 * @description Check that value >= 0
 * */
export function NON_NEGATIVE(value: number) {
	return value >= 0
}

/**
 * @description Check that value > 0
 * */
export function NON_ZERO_NON_NEGATIVE(value: number) {
	return value > 0
}

/**
 * @description Check that value < 0
 * */
export function NON_ZERO_NON_POSITIVE(value: number) {
	return value < 0
}

/**
 * @description Simply return true by default. Use this when a property is allowed directly without any validation
 * */
export function PASSTHROUGH<T>(value: T) {
	return true
}

/**
 * @description Check that string length is greater than zero
 * */
export function STRLEN_GT(len: number) {
	return (value: string) => {
		return (typeof value === 'string' && value.length > len)
	}
}

/**
 * @description Check that string length is greater than or eq to zero
 * */
export function STRLEN_GT_EQ(len: number) {
	return (value: string) => {
		return (typeof value === 'string' && value.length >= len)
	}
}

/**
 * @description Check that string length is equal to specific length only
 * */
export function STRLEN_EQ(len: number) {
	return (value: string) => {
		return (typeof value === 'string' && value.length == len)
	}
}

/**
 * @description Check that string length is lesser than or equal to specific length
 * */
export function STRLEN_LT_EQ(len: number) {
	return (value: string) => {
		return (typeof value === 'string' && value.length <= len)
	}
}

/**
 * @description Check that string length is lesser than specific length
 * */
export function STRLEN_LT(len: number) {
	return (value: string) => {
		return (typeof value === 'string' && value.length < len)
	}
}


/**
 * @description Check that string is non-zero length
 * @see PASSTHROUGH
 * */
export function STRLEN_NZ(value: string) {
	return (typeof value === 'string' && value.length > 0)
}

export function REGEXP_CHECK(regex: RegExp): SharedValidatorFunction<string> {
	return function (stringToCheck) {
		const stringMatches = stringToCheck.match(regex)
		if (stringMatches === null) {
			return false
		}
		if (stringMatches.length === 0) {
			return false
		}
		return true
	}
}

/**
 * @description Take in `value | undefined`, return true if value is undefined. Else, validate and return validation result
 * @param fn A validation function
 * */
export function ALLOW_NULLISH_WITH_FN<T>(fn: SharedValidatorFunction<T>): SharedValidatorFunction<T | undefined | null> {
	return async function (value: T | undefined | null) {
		if (value === undefined || value === null) {
			return true
		} else {
			const fnResult = await fn(value)
			return fnResult
		}
	}
}

/**
 * @description Take in `value | undefined`, return false if value is undefined. Else, validate and return validation result
 * @param fn A validation function
 * */
export function DISALLOW_NULLISH_WITH_FN<T>(fn: SharedValidatorFunction<T>): SharedValidatorFunction<T | undefined | null> {
	return async function (value: T | undefined | null) {
		if (value === undefined || value === null) {
			return false
		} else {
			const fnResult = await fn(value)
			return fnResult
		}
	}
}


/**
 * @description Check if the value passed is in the specific array. Return false if not
 * */
export function IN_ARR<T>(elemArray: T[]): SharedValidatorFunction<T> {
	return function (value: T) {
		return elemArray.includes(value)
	}
}

/**
 * @description Check if the value passed is not in the specific array. Return false if it exists within that array
 * */
export function NOT_IN_ARR<T>(elemArray: T[]): SharedValidatorFunction<T> {
	return function (value: T) {
		return !elemArray.includes(value)
	}
}

/**
 * @description Parse a string value (may come from Params), and execute a validation function on the parsed value
 * @param handlerFn Validation function to execute
 * @param parseMethod Parse method. Default INTEGER
 * */
export function STRING_TO_NUM_FN(handlerFn: (number: number) => (boolean | Promise<boolean>), parseMethod: PARSE_METHOD = PARSE_METHOD.PARSE_INT): SharedValidatorFunction<string> {
	return async function (value: string) {
		const parsedValueFn = [
			Number.parseFloat,
			Number.parseInt
		][parseMethod]
		const parsedValue = parsedValueFn(value)
		if (Number.isNaN(parsedValue)) {
			return false
		}
		if (!Number.isFinite(parsedValue)) {
			return false
		}
		const fnResult = await handlerFn(parsedValue)
		return fnResult
	}
}

