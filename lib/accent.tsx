import React from "react";

/* Render "text with |accented| words" — |...| becomes accent-colored */
export function accent(text: string): React.ReactNode[] {
  return text.split("|").map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="text-accent">{part}</span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

/* Render "\n" as <br/> */
export function lines(text: string): React.ReactNode[] {
  return text.split("\n").map((part, i, arr) => (
    <React.Fragment key={i}>
      {part}
      {i < arr.length - 1 && <br />}
    </React.Fragment>
  ));
}
