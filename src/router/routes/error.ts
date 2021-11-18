import { mapObjIndexed } from "ramda";
import { ValueOf } from "type-fest";
import { ZodError } from "zod";
import { debug } from "../../lib/log";

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number = 502) {
    super(message);
    this.status = status;
  }
}

export const badRequest = (message = 'Bad request') => new ApiError(message, 400);

export type FlatError = {
  formErrors: string[],
  fieldErrors: {[k: string]: string[]}
}
const mergeZodError = (zodError: ZodError): string => {
  const flatError = zodError.flatten();
  const formStr = flatError.formErrors.join('\n');
  const fieldStrList =
    Object.values(
      mapObjIndexed(
        (errorList, fieldName) => errorList.map((error) => `${fieldName}: ${error}`).join('\n'),
        flatError.fieldErrors
      )
    );
  return [formStr, ...fieldStrList].join('\n\n').trim();
}

export const getErrorMessage = (error: unknown) => {
  if (error instanceof ZodError) {
    return String(mergeZodError(error))
  }
  if (error instanceof Error) {
    return String(error.message);
  }
  return String(error);
}
