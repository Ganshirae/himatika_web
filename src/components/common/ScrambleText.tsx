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
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
      setDisplayText(text);
    }, [text]);

    const scramble = useCallback(() => {
      if (isScramblingRef.current) return;
      isScramblingRef.current = true;

      const originalText = text;
      const length = originalText.length;
      let iteration = 0;
      const totalSteps = length * 3; // total iterations for smooth resolve

      const intervalId = setInterval(() => {
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
          clearInterval(intervalId);
          setDisplayText(originalText);
          isScramblingRef.current = false;
        }
      }, scrambleSpeed);

      return () => clearInterval(intervalId);
    }, [text, characters, scrambleSpeed]);

    useImperativeHandle(ref, () => ({
      scramble,
    }));

    useEffect(() => {
      return () => {
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current);
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
