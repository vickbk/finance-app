"use client";
import { useColorsHelper } from "../hooks";
import ParsedColors from "./ParsedColors";
import { SassOutput } from "./SassOutput";
import TailwindOutput from "./TailwindOutput";

export const ColorsHelper = () => {
  const {
    colors,
    setColors,
    parsedColors,
    sassOutput,
    tailwindOutput,
    copiedFormat,
    handleCopy,
  } = useColorsHelper();

  return (
    <section className="flex flex-col gap-4 p-4">
      <label className="flex flex-col gap-2">
        <span className="font-semibold">Colors list</span>
        <textarea
          className="border grow resize-none p-2 rounded"
          name="colors"
          value={colors}
          onChange={({ target: { value } }) => setColors(value)}
          required
          rows={5}
          placeholder="Paste colors from style guide, e.g.:&#10;Neutral 900: hsl(0, 0%, 7%)&#10;Blue 600: hsl(214, 100%, 55%)"
        />
      </label>

      {parsedColors.length > 0 && (
        <>
          <ParsedColors colors={parsedColors} />

          <SassOutput {...{ sassOutput, copiedFormat, handleCopy }} />

          <TailwindOutput {...{ tailwindOutput, copiedFormat, handleCopy }} />
        </>
      )}
    </section>
  );
};
