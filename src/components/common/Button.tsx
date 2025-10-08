export default function Button({ children, onClick, className, style }) {
  return (
    <button
      onClick={onClick}
      className={`font-bold px-6 py-2 cursor-pointer transition-all duration-300 relative ${className}`}
      style={{
        borderRadius: "10px",
        background: "transparent",
        border: "none",
        position: "relative",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(to right, #0a8dd1, #0086e4, #107cf3, #556cfb, #8853fa)";
        e.currentTarget.style.WebkitBackgroundClip = "unset";
        e.currentTarget.style.WebkitTextFillColor = "white";
      }}
      onMouseLeave={(e) => {
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
