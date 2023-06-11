import { forwardRef, type HTMLProps, Ref } from "react";

interface Props {
  disabled?: boolean;
  onClick?: () => void;
}

type CardProps = HTMLProps<HTMLDivElement> & Props;

const BlankCard = (
  { disabled, children, ...props }: CardProps,
  ref: Ref<HTMLDivElement>
) => (
  <div
    className={`flex h-72 w-56 flex-col justify-between space-x-1 rounded-lg ${
      disabled !== true ? "bg-white" : "bg-gray-500"
    } p-4 shadow-md`}
    {...props}
    ref={ref}
  >
    <div className="select-none">{children}</div>
    <div className="select-none text-sm text-gray-600">
      Cards Against Humanity
    </div>
  </div>
);

export default forwardRef<HTMLDivElement, CardProps>(BlankCard);
