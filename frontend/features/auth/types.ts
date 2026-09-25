import { HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

type DataAttributes = Record<
  `data-${string}`,
  string | boolean | number | undefined
>;

export type InputParams = {
  label: string;
  hint?: ReactNode;
  error?: ReactNode;
  labelParams?: HTMLAttributes<HTMLLabelElement> & DataAttributes;
  inputParams?: InputHTMLAttributes<HTMLInputElement> & DataAttributes;
};
