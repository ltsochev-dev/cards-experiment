import { useState } from "react";

type UseToggleReturn = [boolean, () => void, (_value: boolean) => void];

const useToggle = (defaultValue = false): UseToggleReturn => {
  const [state, setState] = useState(defaultValue);

  const toggle = () => {
    setState((prev) => !prev);
  };

  const setToggleStatus = (value: boolean) => setState(value);

  return [state, toggle, setToggleStatus];
};

export default useToggle;
