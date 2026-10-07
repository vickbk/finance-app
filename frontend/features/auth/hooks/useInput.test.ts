import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useInput } from "./useInput";

describe("useInput", () => {
  describe("Default Initialization & ID Generation", () => {
    it("returns default input and label params with a fallback ID", () => {
      const { result } = renderHook(() => useInput({}));

      expect(result.current.inputParams.type).toBe("text");
      expect(result.current.inputParams.id).toMatch(/^field-\w+/);
      expect(result.current.labelParams.htmlFor).toBe(
        result.current.inputParams.id,
      );
      expect(result.current.errorId).toBe(
        `${result.current.inputParams.id}-error`,
      );
      expect(result.current.hintId).toBe(
        `${result.current.inputParams.id}-hint`,
      );
      expect(result.current.isPasswordType).toBe(false);
      expect(result.current.showPassword).toBe(false);
    });

    it("constructs ID using input name when present", () => {
      const { result } = renderHook(() =>
        useInput({
          inputParams: { name: "email" },
        }),
      );

      expect(result.current.inputParams.id).toMatch(/^field-email-\w+/);
      expect(result.current.labelParams.htmlFor).toBe(
        result.current.inputParams.id,
      );
    });

    it("uses customId over name and generated ID", () => {
      const { result } = renderHook(() =>
        useInput({
          inputParams: { id: "custom-input-id", name: "email" },
        }),
      );

      expect(result.current.inputParams.id).toBe("custom-input-id");
      expect(result.current.labelParams.htmlFor).toBe("custom-input-id");
      expect(result.current.errorId).toBe("custom-input-id-error");
      expect(result.current.hintId).toBe("custom-input-id-hint");
    });
  });

  describe("ARIA Attributes & Validation State", () => {
    it("sets aria-invalid to false when error is absent", () => {
      const { result } = renderHook(() => useInput({}));

      expect(result.current.inputParams["aria-invalid"]).toBe(false);
      expect(result.current.inputParams["aria-describedby"]).toBeUndefined();
    });

    it("sets aria-invalid to true when error is provided", () => {
      const { result } = renderHook(() =>
        useInput({ error: "Email is required" }),
      );

      expect(result.current.inputParams["aria-invalid"]).toBe(true);
      expect(result.current.error).toBe("Email is required");
    });

    it("links hintId in aria-describedby when hint is present", () => {
      const { result } = renderHook(() =>
        useInput({ hint: "Enter a valid email" }),
      );

      expect(result.current.inputParams["aria-describedby"]).toBe(
        result.current.hintId,
      );
    });

    it("links errorId in aria-describedby when error is present", () => {
      const { result } = renderHook(() =>
        useInput({ error: "Invalid format" }),
      );

      expect(result.current.inputParams["aria-describedby"]).toBe(
        result.current.errorId,
      );
    });

    it("combines hintId, errorId, and existing aria-describedby", () => {
      const { result } = renderHook(() =>
        useInput({
          hint: "Must be 8+ chars",
          error: "Too short",
          inputParams: { "aria-describedby": "external-help-id" },
        }),
      );

      const expectedDescribedBy = `${result.current.hintId} ${result.current.errorId} external-help-id`;
      expect(result.current.inputParams["aria-describedby"]).toBe(
        expectedDescribedBy,
      );
    });
  });

  describe("Password Type & Toggle Logic", () => {
    it("identifies password type and allows toggling computedType", () => {
      const { result } = renderHook(() =>
        useInput({ inputParams: { type: "password" } }),
      );

      expect(result.current.isPasswordType).toBe(true);
      expect(result.current.showPassword).toBe(false);
      expect(result.current.inputParams.type).toBe("password");

      act(() => {
        result.current.togglePassword();
      });

      expect(result.current.showPassword).toBe(true);
      expect(result.current.inputParams.type).toBe("text");

      act(() => {
        result.current.togglePassword();
      });

      expect(result.current.showPassword).toBe(false);
      expect(result.current.inputParams.type).toBe("password");
    });

    it("disables password features when input is disabled", () => {
      const { result } = renderHook(() =>
        useInput({
          inputParams: { type: "password", disabled: true },
        }),
      );

      expect(result.current.isPasswordType).toBe(false);
      expect(result.current.inputParams.type).toBe("password");

      act(() => {
        result.current.togglePassword();
      });

      expect(result.current.showPassword).toBe(false);
      expect(result.current.inputParams.type).toBe("password");
    });

    it("disables password features when input is readOnly", () => {
      const { result } = renderHook(() =>
        useInput({
          inputParams: { type: "password", readOnly: true },
        }),
      );

      expect(result.current.isPasswordType).toBe(false);
      expect(result.current.inputParams.type).toBe("password");

      act(() => {
        result.current.togglePassword();
      });

      expect(result.current.showPassword).toBe(false);
      expect(result.current.inputParams.type).toBe("password");
    });

    it("ignores togglePassword for non-password field types", () => {
      const { result } = renderHook(() =>
        useInput({ inputParams: { type: "email" } }),
      );

      expect(result.current.isPasswordType).toBe(false);

      act(() => {
        result.current.togglePassword();
      });

      expect(result.current.showPassword).toBe(false);
      expect(result.current.inputParams.type).toBe("email");
    });
  });

  describe("Params Passthrough", () => {
    it("preserves additional input and label properties", () => {
      const onBlurMock = () => {};
      const { result } = renderHook(() =>
        useInput({
          labelParams: { className: "text-slate-200" },
          inputParams: {
            placeholder: "John",
            onBlur: onBlurMock,
            required: true,
          },
        }),
      );

      expect(result.current.labelParams.className).toBe("text-slate-200");
      expect(result.current.inputParams.placeholder).toBe("John");
      expect(result.current.inputParams.onBlur).toBe(onBlurMock);
      expect(result.current.inputParams.required).toBe(true);
    });
  });
});
