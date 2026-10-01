// test-utils/resolveRscTree.ts
import React, { FC, ReactNode, isValidElement } from "react";

/**
 * Checks if a component type is a React Client Component or uses React Hooks.
 * Invoking functions with hooks outside React's render phase triggers "Invalid hook call".
 */
function isClientComponentOrUsesHooks(type: unknown): boolean {
  if (!type) return false;

  // 1. React internal wrappers (forwardRef, memo, client references)
  if (typeof type === "object") {
    return true;
  }

  if (typeof type === "function") {
    // 2. Check for React Client Reference symbol ($$typeof)
    if (
      (type as unknown as { $$typeof: unknown }).$$typeof ===
      Symbol.for("react.client.reference")
    ) {
      return true;
    }

    // 3. Inspect source code for React Hook calls (e.g. useState, useInput, useId)
    const fnStr = type.toString();
    if (/\buse[A-Z0-9_]/.test(fnStr)) {
      return true;
    }
  }

  return false;
}

/**
 * Recursively unwraps Next.js / React 19 Async Server Components in JSDOM testing.
 * Bypasses Client Components so React DOM renders them natively.
 */
export async function resolveRscTree(node: ReactNode): Promise<ReactNode> {
  if (!node || typeof node !== "object") return node;

  // Handle array of nodes (e.g. children lists)
  if (Array.isArray(node)) {
    return Promise.all(
      node.map(async (child, index) => {
        const resolvedChild = await resolveRscTree(child);

        if (isValidElement(resolvedChild)) {
          const keyToUse =
            resolvedChild.key ??
            (isValidElement(child) ? child.key : null) ??
            `rsc-key-${index}`;

          return React.cloneElement(resolvedChild, { key: keyToUse });
        }

        return resolvedChild;
      }),
    );
  }

  if (isValidElement(node)) {
    const { type, props } = node;

    // 1. Only execute Server Components that DO NOT use React Hooks
    if (typeof type === "function" && !isClientComponentOrUsesHooks(type)) {
      try {
        const result = (type as FC<object>)(props as object);

        // Handle Async Server Components (Promise return)
        if (
          result &&
          typeof (result as { then?: () => unknown }).then === "function"
        ) {
          const asyncJsx = await result;
          return resolveRscTree(asyncJsx);
        }

        // Handle Sync Server Components returning JSX
        if (isValidElement(result) || Array.isArray(result)) {
          return resolveRscTree(result);
        }
      } catch {
        // Fall back to native React DOM rendering on error
      }
    }

    // 2. Recursively traverse props and nested children (e.g. layout children)
    if (props && typeof props === "object") {
      const newProps: Record<string, unknown> = { ...(props as object) };
      let hasResolvedProps = false;

      for (const key of Object.keys(newProps)) {
        const propValue = newProps[key];
        if (isValidElement(propValue) || Array.isArray(propValue)) {
          const resolved = await resolveRscTree(propValue);
          if (resolved !== propValue) {
            newProps[key] = resolved;
            hasResolvedProps = true;
          }
        }
      }

      if (hasResolvedProps) {
        return { ...node, props: newProps };
      }
    }
  }

  return node;
}
