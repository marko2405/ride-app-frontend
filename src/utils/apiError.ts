import { isAxiosError } from "axios";

type ApiErrorBody = {
  message?: unknown;
  error?: unknown;
};

const toMessage = (value: unknown) => {
  return typeof value === "string" && value.trim() ? value : null;
};

export const getApiErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiErrorBody>(error)) {
    const responseData = error.response?.data;
    const responseMessage = toMessage(responseData?.message);
    const responseError = toMessage(responseData?.error);
    const errorMessage = toMessage(error.message);

    return (
      responseMessage ||
      responseError ||
      errorMessage ||
      "Something went wrong"
    );
  }

  if (error instanceof Error) {
    return toMessage(error.message) || "Something went wrong";
  }

  return "Something went wrong";
};
