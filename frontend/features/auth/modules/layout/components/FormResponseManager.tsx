import { FormResponse } from "../types";

export function FormResponseManager({
  success,
  message = "Operation successful",
  error = "Something went wrong",
}: FormResponse) {
  return <p aria-live="polite">{success ? message : error}</p>;
}
