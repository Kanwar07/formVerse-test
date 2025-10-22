interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  className = "",
  style = {},
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`font-bold px-6 py-2 cursor-pointer transition-all duration-300 relative ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      style={{
        borderRadius: "10px",
        background: disabled ? undefined : "transparent",
        border: "none",
        position: "relative",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.background =
          "linear-gradient(to right, #0a8dd1, #0086e4, #107cf3, #556cfb, #8853fa)";
        e.currentTarget.style.WebkitBackgroundClip = "unset";
        e.currentTarget.style.WebkitTextFillColor = "white";
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.WebkitBackgroundClip = "text";
        e.currentTarget.style.WebkitTextFillColor = "white";
      }}
    >
      {/* Gradient border using pseudo-element */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "2px",
          background:
            "linear-gradient(to right, #0a8dd1, #0086e4, #107cf3, #556cfb, #8853fa)",
          borderRadius: "10px",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
          opacity: disabled ? 0.3 : 1,
        }}
      />
      <span
        style={{
          color: "white",
          fontSize: "16px",
          fontWeight: "800",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </span>
    </button>
  );
}
