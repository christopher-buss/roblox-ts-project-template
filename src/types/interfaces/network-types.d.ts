type ServerResponseOk<T = void> = UndefinedToOptional<{
	data: T;
	success: true;
}>;

interface ServerResponseErr {
	error: number | string;
	success: false;
}

export type ServerResponse<T = void> = ServerResponseOk<T> | ServerResponseErr;
