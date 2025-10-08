import appCodes, { AppCode, AppCodeProp } from "./appCodes";

interface genericResponse {
	code: string;
	message: string;
	data: {
		any: any;
	};
	dataSize?: number;
}

interface genericError {
	code: string;
	message: string;
	error: {
		any: any;
	};
}

function generateResponse(
	code: string,
	message: string,
	data: any,
	dataSize?: number
) {
	const response: genericResponse = {
		code: code,
		message: message,
		data: data,
		dataSize: dataSize,
	};
	return response;
}

function generateErrResponse(code: string, message: string, error: any) {
	const response: genericError = {
		code: code,
		message: message,
		error: error,
	};
	return response;
}

interface GenerateResponseProps {
	message?: string;
	totalRecords?: number;
	error?: any;
	data?: any;
	statusCode?: number;
	code?: AppCode | string;
}

export interface ResponseProps {
	statusCode: number;
	success: boolean;
	message: string;
	code: AppCode | string;
	data?: any;
	error?: any;
}

function generate(code: AppCode, props?: GenerateResponseProps) {
	const { message, statusCode, success } =
		appCodes.find((e) => e.code === code) || ({} as AppCodeProp);
	let response: ResponseProps = {
		code,
		statusCode: statusCode || props?.error.statusCode,
		success,
		message: message || props?.message || "",
	};

	if (success) {
		response = { ...response, data: props?.data };
	} else {
		response = {
			code: props?.code || props?.error.code,
			statusCode: props?.statusCode || props?.error.statusCode,
			message: props?.message || props?.error.message,
			error: props?.error || props?.message || "",
			success: false,
		};
		// if (
		// 	props?.error?.code &&
		// 	props?.error?.statusCode &&
		// 	props?.error?.message
		// ) {
		// 	response = {
		// 		code: props?.code || props?.error.code,
		// 		statusCode: props.statusCode || props?.error.statusCode,
		// 		message: props?.error.message,
		// 		error: props?.message,
		// 		success: success,
		// 	};
		// } else {
		// 	response = { ...response, error: props?.error?.toString() };
		// }
	}

	return response;
}

const responses = { generateResponse, generateErrResponse };

export default responses;
export { generate };
