import { ReturnUseColorsHelpers } from "../types";

export default function TailwindOutput({
  tailwindOutput,
  copiedFormat,
  handleCopy,
}: Pick<
  ReturnUseColorsHelpers,
  "tailwindOutput" | "copiedFormat" | "handleCopy"
>) {
  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Tailwind CSS v4</h3>
        <button
          type="button"
          className="px-2 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => handleCopy(tailwindOutput, "tailwind")}
        >
          {copiedFormat === "tailwind" ? "Copied!" : "Copy Tailwind"}
        </button>
      </div>
      <pre className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded text-sm overflow-x-auto">
        <code>{tailwindOutput}</code>
      </pre>
    </section>
  );
}
