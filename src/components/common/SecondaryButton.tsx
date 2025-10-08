import { useState } from "react";

export default function SecondaryButton({
  children,
  onClick,
  className,
  style,
}) {
  const [hovered, setHovered] = useState(false);

  const normalGradient =
    "linear-gradient(to right, #0a8dd1, #0086e4, #107cf3, #556cfb, #8853fa)";
  const hoverGradient =
    "linear-gradient(to right, #8853fa, #556cfb, #107cf3, #0086e4, #0a8dd1)";

  return (
    <button
      onClick={onClick}
      className={`font-bold px-6 py-2 cursor-pointer relative ${className}`}
      style={{
        borderRadius: "10px",
        border: "none",
        position: "relative",
        background: hovered ? hoverGradient : normalGradient,
        transition: "background 0.5s ease",
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "2px",
          background: hovered ? hoverGradient : normalGradient,
          borderRadius: "10px",
          transition: "background 0.5s ease",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
        }}
      />
      <span
        style={{
          color: "#ffffff",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </span>
    </button>
  );
}
