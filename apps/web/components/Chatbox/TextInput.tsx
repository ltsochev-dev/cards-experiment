import { HTMLProps, ReactNode } from "react";

type Props = HTMLProps<HTMLInputElement> & {
  InputAdornment?: ReactNode;
};

const TextInput = ({ InputAdornment, className, ...props }: Props) => {
  return (
    <div className="relative">
      <input
        type="text"
        {...props}
        className={`w-full rounded-md border border-gray-300 p-4 shadow-sm focus:border-blue-500 focus:outline-none ${className}`}
      />
      {InputAdornment && (
        <div className="absolute bottom-2.5 right-2.5">{InputAdornment}</div>
      )}
    </div>
  );
};

export default TextInput;
