import { Dispatch, SetStateAction } from "react";

export type ParsedColor = {
  name: string;
  value: string;
};

export type ReturnUseColorsHelpers = {
  colors: string;
  setColors: Dispatch<SetStateAction<string>>;
  parsedColors: ParsedColor[];
  copiedFormat: string | null;
  handleCopy(text: string, format: string): Promise<void>;
  sassOutput: string;
  tailwindOutput: string;
};
