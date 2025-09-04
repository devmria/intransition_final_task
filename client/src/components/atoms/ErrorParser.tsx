export function parseAxiosError(error: any): Error {
  if (error.response?.data?.error) {
    return new Error(error.response.data.error);
  }
  if (error.request) return new Error("Server did not respond.");
  return new Error("Unknown error occurred.");
}