"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

export interface ScrambleTextHandle {
  scramble: () => void;
}

interface ScrambleTextProps {
  text: string;
  className?: string;
  scrambleSpeed?: number; // ms per step
  characters?: string;
  triggerOnHover?: boolean;
}

const DEFAULT_CHARS = "!<>-_\\/[]{}—=+*^?#0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const ScrambleText = forwardRef<ScrambleTextHandle, ScrambleTextProps>(
  (
    {
      text,
      className = "",
      scrambleSpeed = 25,
      characters = DEFAULT_CHARS,
      triggerOnHover = true,
    },
    ref
  ) => {
    const [displayText, setDisplayText] = useState(text);
    const isScramblingRef = useRef(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
      setDisplayText(text);
    }, [text]);

    const scramble = useCallback(() => {
      if (isScramblingRef.current) return;
      isScramblingRef.current = true;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const originalText = text;
      const length = originalText.length;
      let iteration = 0;
      const totalSteps = length * 3; // total iterations for smooth resolve

      intervalRef.current = setInterval(() => {
        setDisplayText(() => {
          return originalText
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iteration / 3) {
                return originalText[index];
              }
              return characters[Math.floor(Math.random() * characters.length)];
            })
            .join("");
        });

        iteration += 1;

        if (iteration >= totalSteps) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setDisplayText(originalText);
          isScramblingRef.current = false;
        }
      }, scrambleSpeed);
    }, [text, characters, scrambleSpeed]);

    useImperativeHandle(ref, () => ({
      scramble,
    }));

    useEffect(() => {
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, []);

    return (
      <span
        className={className}
        onMouseEnter={triggerOnHover ? scramble : undefined}
        style={{ display: "inline-block" }}
      >
        {displayText}
      </span>
    );
  }
);

ScrambleText.displayName = "ScrambleText";

export default ScrambleText;
