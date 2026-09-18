"use client";

import { BiIcon, SRHidden, SROnly } from "@/shared/utils";
import { useInput } from "../hooks/useInput";
import { InputParams } from "../types";

export function Input({ label, ...params }: InputParams) {
  const {
    inputParams,
    labelParams,
    error,
    errorId,
    hint,
    hintId,
    isPasswordType,
    showPassword,
    togglePassword,
  } = useInput(params);

  return (
    <div className="input-group">
      <label {...labelParams}>
        {label} {inputParams.required && <SRHidden>*</SRHidden>}
      </label>

      <div className="input-wrapper relative">
        <input {...inputParams} />
        {isPasswordType && (
          <button type="button" onClick={togglePassword}>
            <SROnly>{showPassword ? "Hide" : "Show"} password</SROnly>
            <BiIcon name={showPassword ? "eye-slash" : "eye"} />
          </button>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="error-message">
          {error}
        </p>
      )}

      {hint && <span id={hintId}>{hint}</span>}
    </div>
  );
}
