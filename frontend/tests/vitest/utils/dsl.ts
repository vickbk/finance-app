import { patternToRegex, TEXT_MATCHER, TEXT_PATTERN } from "@/tests/common";
import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect } from "vitest";
import { ToggleState } from "../types";

const user = userEvent.setup();

function shouldGetByText(...textes: TEXT_MATCHER[]) {
  return textes.map((text) => {
    if (Array.isArray(text)) {
      const [matcher, nth] = text;
      const element =
        screen.queryAllByText(patternToRegex(matcher))[nth] ?? null;
      return { expected: expect(element), element };
    }
    const element = screen.queryByText(patternToRegex(text));
    return { expected: expect(element), element };
  });
}

/**
 * Asserts that an HTMLElement possesses the expected set of DOM attributes and values.
 *
 * Handles string/numeric values, boolean attributes (true = present, false = absent),
 * and null/undefined values (absent).
 */
export function shouldHaveAttributes(
  element: HTMLElement,
  attributes: Record<string, unknown>,
): void {
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === null || value === false) {
      expect(element).not.toHaveAttribute(key);
    } else if (value === true) {
      expect(element).toHaveAttribute(key);
    } else {
      expect(element).toHaveAttribute(key, String(value));
    }
  });
}

export const shouldSee = (...texts: TEXT_MATCHER[]) => {
  return shouldGetByText(...texts).map(({ expected, element }) => {
    expected.toBeInTheDocument();
    return element!;
  });
};

export const shouldNotSee = (...texts: (string | RegExp)[]) => {
  shouldGetByText(...texts).forEach(({ expected }) =>
    expected.not.toBeInTheDocument(),
  );
};

export const userClicks = async (
  target: string | RegExp,
  container?: HTMLElement,
) => {
  const regex = patternToRegex(target);

  const searchArea = getSearchArea(container);
  const element =
    searchArea.queryByRole("button", { name: regex }) ||
    searchArea.getByText(regex);

  await user.click(element);
};

export async function clickLabelInput(
  label: TEXT_PATTERN,
  container?: HTMLElement,
) {
  const regex = patternToRegex(label);

  const searchArea = getSearchArea(container);
  const element =
    searchArea.getByLabelText(regex) || searchArea.getByPlaceholderText(label);
  await user.click(element);
}

export const userTypes = async (
  target: string | RegExp,
  text: string,
  container?: HTMLElement,
  user = userEvent.setup(),
) => {
  const regex = patternToRegex(target);

  const searchArea = getSearchArea(container);
  const element =
    searchArea.queryByLabelText(regex) ||
    searchArea.queryByPlaceholderText(regex) ||
    searchArea.getByRole("textbox", { name: regex });

  await user.clear(element);
  await user.type(element, text);
  return element;
};

export async function userTypesMultiple(
  inputs: Record<string, string>,
  container?: HTMLElement,
) {
  const entries = Object.entries(inputs);
  const outputs: Record<keyof typeof inputs, HTMLElement> = {};

  for (const [selector, value] of entries) {
    outputs[selector] = await userTypes(selector, value, container);
  }

  return outputs;
}

function getRadioOrCheckboxAssertion(
  selector: TEXT_PATTERN,
  container?: HTMLElement,
) {
  const searchArea = getSearchArea(container);

  const name = patternToRegex(selector);
  const element =
    searchArea.getByLabelText(name) ||
    searchArea.getByRole("radio", { name }) ||
    searchArea.getByRole("checkbox", { name });
  return expect(element);
}
export function isChecked(selector: TEXT_PATTERN, container?: HTMLElement) {
  getRadioOrCheckboxAssertion(selector, container).toBeChecked();
}

export function isNotChecked(selector: TEXT_PATTERN, container?: HTMLElement) {
  getRadioOrCheckboxAssertion(selector, container).not.toBeChecked();
}

function getSearchArea(container?: HTMLElement) {
  return container ? within(container) : screen;
}

export function resolvedPromise<T>(value: T) {
  const promise = Promise.resolve(value);
  return Object.assign(promise, { status: "fulfilled" as const, value });
}

export function rejectedPromise(reason: unknown) {
  const promise = Promise.reject(reason);
  promise.catch(() => {}); // Suppresses Vitest unhandledRejection noise
  return Object.assign(promise, { status: "rejected" as const, reason });
}

export function togglePopover({
  container,
  selector,
  newState = "open",
}: {
  container?: HTMLElement;
  selector: string;
  newState?: ToggleState;
}) {
  const element = (container ?? document).querySelector(selector);
  if (!element) return;
  fireEvent.toggle(element, { newState });
  return element;
}

export function shouldHaveTestId(...ids: string[]) {
  const testElements = ids.map((id) => screen.getByTestId(id));

  testElements.forEach((element) => expect(element).toBeInTheDocument());
  return testElements;
}

export function shouldNotHaveTestId(...ids: string[]) {
  const testElements = ids.map((id) => screen.queryByTestId(id));

  testElements.forEach((element) => expect(element).not.toBeInTheDocument());
  return testElements;
}
