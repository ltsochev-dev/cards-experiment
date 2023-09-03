"use client";

import React, { forwardRef, useState, type Ref, HTMLProps } from "react";

type InputRef = HTMLInputElement;
type InputBtnProps = Omit<HTMLProps<HTMLInputElement>, "className"> & {
  label?: string;
  buttonLabel?: string;
  ButtonProps?: Omit<HTMLProps<HTMLButtonElement>, "className" | "type">;
  LabelProps?: Omit<HTMLProps<HTMLLabelElement>, "className">;
  onBtnSubmit?: (_: string) => void;
};

const InputWithButton = (
  {
    label = "",
    LabelProps,
    buttonLabel,
    ButtonProps,
    onBtnSubmit,
    ...props
  }: InputBtnProps,
  ref: Ref<InputRef>
) => {
  const [value, setValue] = useState("");

  return (
    <>
      {label?.length > 0 && (
        <label
          {...LabelProps}
          className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          {...props}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
        <button
          type="button"
          disabled={props.disabled}
          {...ButtonProps}
          onClick={() => onBtnSubmit && onBtnSubmit(value)}
          className="absolute bottom-2.5 right-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {buttonLabel}
        </button>
      </div>
    </>
  );
};

export default forwardRef<InputRef, InputBtnProps>(InputWithButton);
