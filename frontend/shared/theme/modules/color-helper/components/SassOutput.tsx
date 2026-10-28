import { ReturnUseColorsHelpers } from "../types";

export function SassOutput({
  sassOutput,
  copiedFormat,
  handleCopy,
}: Pick<ReturnUseColorsHelpers, "sassOutput" | "copiedFormat" | "handleCopy">) {
  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">SASS Variables</h3>
        <button
          type="button"
          className="px-2 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => handleCopy(sassOutput, "sass")}
        >
          {copiedFormat === "sass" ? "Copied!" : "Copy SASS"}
        </button>
      </div>
      <pre className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded text-sm overflow-x-auto">
        <code>{sassOutput}</code>
      </pre>
    </section>
  );
}
