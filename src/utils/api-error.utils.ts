type TApiError = {
  message: string;
  statusCode: number;
  name?:
    | "EXPRESS_VALIDATION_ERROR"
    | "MONGOOSE_ERROR"
    | "VALIDATION_ERROR"
    | "AUTHENTICATION_ERROR"
    | "TOKEN_EXPIRATION_ERROR"
    | "AUTHORIZATION_ERROR"
    | "NOT_FOUND_ERROR"
    | "PAGINATION_ERROR"
    | "B2_ERROR"
    | "OTHERS";
};

export default class ApiError extends Error {
  public statusCode: number;

  constructor({ message, statusCode, name = "OTHERS" }: TApiError) {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
  }
}
