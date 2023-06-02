"use client";

import React from "react";
import InputWithButton from "@/components/InputWithButton";

interface Props {
  disabled?: boolean;
  onChange?: (username: string) => void;
}

const UsernameContainer = ({ disabled, onChange }: Props) => {
  const handleSubmit = (value: string) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="username-container">
      <div className="relative flex w-full max-w-[768px]">
        <InputWithButton
          label="Enter your username"
          buttonLabel="Submit"
          onBtnSubmit={handleSubmit}
          disabled={disabled}
          onKeyUp={(e) =>
            e.key === "Enter" && handleSubmit(e.currentTarget.value)
          }
        />
      </div>
    </div>
  );
};

export default UsernameContainer;
