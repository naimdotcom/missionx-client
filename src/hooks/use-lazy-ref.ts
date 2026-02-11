import * as React from "react";

function useLazyRef<T>(fn: () => T): React.MutableRefObject<T> {
  const ref = React.useRef<T>();

  if (ref.current === undefined) {
    ref.current = fn();
  }

  return ref as React.MutableRefObject<T>;
}

export { useLazyRef };
