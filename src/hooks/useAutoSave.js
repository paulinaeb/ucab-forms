import { useState } from "react";

const useAutoSave = (seconds = 2) => {
  const [timeoutId, setTimeoutId] = useState(null);

  const autoSave = (callback) => {
    clearTimeout(timeoutId);

    const id = setTimeout(callback, seconds * 1000);

    setTimeoutId(id);
  };

  return autoSave;
};

export default useAutoSave;
