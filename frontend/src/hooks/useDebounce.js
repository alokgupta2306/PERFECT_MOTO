import { useState, useEffect } from "react";

const useDebounce = (inputValue, delayTimeout = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  useEffect(() => {
    const threadHandler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delayTimeout);

    return () => {
      clearTimeout(threadHandler);
    };
  }, [inputValue, delayTimeout]);

  return debouncedValue;
};

export default useDebounce;