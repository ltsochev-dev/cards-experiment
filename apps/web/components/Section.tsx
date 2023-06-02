import { PropsWithChildren } from "react";

const Section = ({ children }: PropsWithChildren) => {
  return (
    <div className="section mx-auto min-h-screen max-w-screen-xl px-6">
      {children}
    </div>
  );
};

export default Section;
