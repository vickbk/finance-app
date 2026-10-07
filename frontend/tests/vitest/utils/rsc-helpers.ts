// test-utils/resolveRscTree.ts
import React, { ComponentType, FC, ReactNode, isValidElement } from "react";

/**
 * Checks if a component type is a React Client Component or uses React Hooks.
 * Invoking functions with hooks outside React's render phase triggers "Invalid hook call".
 */
function isClientComponentOrUsesHooks(type: unknown): boolean {
  if (!type) return false;
  if (typeof type === "object") return true;

  if (typeof type === "function") {
    if (
      (type as { $$typeof?: symbol }).$$typeof ===
      Symbol.for("react.client.reference")
    ) {
      return true;
    }
    if (/\buse[A-Z0-9_]/.test(type.toString())) {
      return true;
    }
  }

  return false;
}

/**
 * Resolves promises returned by async server components or sync server component results.
 */
/**
 * Resolves promises returned by async server components or sync server component results.
 */
async function executeServerComponent(
  type: ComponentType<Record<string, unknown>>,
  props: Record<string, unknown>,
): Promise<ReactNode> {
  try {
    const result = (type as FC<Record<string, unknown>>)(props);
    if (result && typeof (result as Promise<ReactNode>).then === "function") {
      return await (result as Promise<ReactNode>);
    }
    return result as ReactNode;
  } catch {
    return null;
  }
}

/**
 * Traverses and resolves nested elements within component props.
 */
async function resolveProps(
  props: Record<string, unknown>,
): Promise<{ newProps: Record<string, unknown>; hasChanged: boolean }> {
  const newProps: Record<string, unknown> = { ...props };
  let hasChanged = false;

  for (const key of Object.keys(newProps)) {
    const value = newProps[key];
    if (isValidElement(value) || Array.isArray(value)) {
      const resolved = await resolveRscTree(value as ReactNode);
      if (resolved !== value) {
        newProps[key] = resolved;
        hasChanged = true;
      }
    }
  }

  return { newProps, hasChanged };
}

/**
 * Resolves a single child element within an array, ensuring unique keys.
 */
async function resolveArrayChild(
  child: ReactNode,
  index: number,
): Promise<ReactNode> {
  const resolvedChild = await resolveRscTree(child);
  if (isValidElement(resolvedChild)) {
    const keyToUse =
      resolvedChild.key ??
      (isValidElement(child) ? child.key : null) ??
      `rsc-key-${index}`;
    return React.cloneElement(resolvedChild, { key: keyToUse });
  }
  return resolvedChild;
}

/** 

    Resolves valid server component elements or updates element props recursively.
    */
async function resolveElement(node: React.ReactElement): Promise<ReactNode> {
  const { type, props } = node;

  if (typeof type === "function" && !isClientComponentOrUsesHooks(type)) {
    const serverResult = await executeServerComponent(
      type as ComponentType,
      (props ?? {}) as Record<string, unknown>,
    );
    if (
      serverResult !== null &&
      (isValidElement(serverResult) || Array.isArray(serverResult))
    ) {
      return resolveRscTree(serverResult);
    }
  }

  if (props && typeof props === "object") {
    const { newProps, hasChanged } = await resolveProps(
      props as Record<string, unknown>,
    );
    if (hasChanged) {
      return React.cloneElement(node, newProps);
    }
  }

  return node;
}

/**
 * Recursively unwraps Next.js / React 19 Async Server Components in JSDOM testing.
 * Bypasses Client Components so React DOM renders them natively.
 */
export async function resolveRscTree(node: ReactNode): Promise<ReactNode> {
  if (!node || typeof node !== "object") return node;

  if (Array.isArray(node)) {
    return Promise.all(node.map(resolveArrayChild));
  }

  if (isValidElement(node)) {
    return resolveElement(node);
  }

  return node;
}
