import { useState, useMemo } from "react";

function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);
  const handlers = useMemo(
    () => ({
      on: () => setState(true),
      off: () => setState(false),
      toggle: () => setState((s) => !s),
      reset: () => setState(initialState),
    }),
    [initialState],
  );

  return [state, handlers];
}

export default useToggle;
