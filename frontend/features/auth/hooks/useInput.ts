"use client";

import { useId, useState } from "react";
import { InputParams } from "../types";

export function useInput({
  hint,
  error,
  inputParams: { type = "text", id: customId, ...inputParams } = {},
  labelParams = {},
}: Omit<InputParams, "label">) {
  const generatedId = useId();
  const inputId =
    customId ??
    ["field", inputParams["name"], generatedId].filter(Boolean).join("-");
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType =
    type === "password" &&
    !Boolean(inputParams.disabled || inputParams.readOnly);
  const computedType = isPasswordType && showPassword ? "text" : type;

  const describedBy = [
    hint && hintId,
    error && errorId,
    inputParams["aria-describedby"],
  ]
    .filter(Boolean)
    .join(" ");

  return {
    isPasswordType,
    showPassword,
    togglePassword() {
      if (!isPasswordType) return;
      setShowPassword((state) => !state);
    },

    inputParams: {
      ...inputParams,
      type: computedType,
      "aria-describedby": describedBy || undefined,
      "aria-invalid": Boolean(error),
      id: inputId,
    },
    labelParams: {
      ...labelParams,
      htmlFor: inputId,
    },

    errorId,
    error,

    hintId,
    hint,
  };
}
