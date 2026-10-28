import { ParsedColor } from "../types";

export default function ParsedColors({ colors }: { colors: ParsedColor[] }) {
  return (
    <section>
      <h3 className="font-semibold mb-2">Parsed Colors</h3>
      <ul className="flex flex-wrap gap-2">
        {colors.map(({ name, value }) => (
          <li
            key={name}
            className="flex items-center gap-2 px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800"
          >
            <span
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: `hsl(${value})` }}
            />
            <code className="text-sm">
              {name}:{value}
            </code>
          </li>
        ))}
      </ul>
    </section>
  );
}
