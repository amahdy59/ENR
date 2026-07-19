import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type Politeness = "polite" | "assertive";
type AnnounceFn = (message: string, politeness?: Politeness) => void;

const AnnouncerContext = createContext<AnnounceFn>(() => {});

/** Read the latest announcement queued for screen readers. Wrap the app once. */
export function AnnouncerProvider({ children }: { children: ReactNode }) {
  const [polite, setPolite] = useState("");
  const [assertive, setAssertive] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const announce = useCallback<AnnounceFn>((message, politeness = "polite") => {
    if (!message) return;
    // Toggle the string to guarantee AT re-announcement even for the same text.
    const stamped = message + "\u200b".repeat((Math.random() * 3) | 0);
    if (politeness === "assertive") setAssertive(stamped);
    else setPolite(stamped);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setPolite("");
      setAssertive("");
    }, 3000);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <AnnouncerContext.Provider value={announce}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {polite}
      </div>
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertive}
      </div>
    </AnnouncerContext.Provider>
  );
}

/** Announce a message to screen readers. Prefer polite; use assertive for errors. */
export function useAnnounce(): AnnounceFn {
  return useContext(AnnouncerContext);
}
