import { useEffect, useState } from "react";

export function useLoadingDelay(isLoading: boolean, delay = 200) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isLoading) { setShow(false); return; }
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [isLoading, delay]);

  return show;
}
