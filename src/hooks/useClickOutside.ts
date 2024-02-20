import { useEffect } from "react";
import type { MutableRefObject } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useClickOutside(
  ref: MutableRefObject<HTMLDivElement | Element | null>,
  callback?: () => void
) {
  useEffect(() => {
    /**
     * Run if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback?.();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback, ref]);
}
