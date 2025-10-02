export default function Button({ children, onClick, className, style }) {
  return (
    <button
      onClick={onClick}
      className={`w-60 font-bold rounded-[10px] px-6 py-2 cursor-pointer transition-all duration-300 ${className}`}
      style={{
        border: "2px solid",
        borderImage:
          "linear-gradient(to right, #0a8dd1, #0086e4, #107cf3, #556cfb, #8853fa) 1",
        backgroundImage:
          "linear-gradient(to right, #97dbff, #92d1ff, #99c5ff, #abb7ff, #c2a6ff)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundImage =
          "linear-gradient(to right, #0a8dd1, #0086e4, #107cf3, #556cfb, #8853fa)";
        e.currentTarget.style.WebkitBackgroundClip = "unset";
        e.currentTarget.style.WebkitTextFillColor = "white";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundImage =
          "linear-gradient(to right, #97dbff, #92d1ff, #99c5ff, #abb7ff, #c2a6ff)";
        e.currentTarget.style.WebkitBackgroundClip = "text";
        e.currentTarget.style.WebkitTextFillColor = "transparent";
      }}
    >
      {children}
    </button>
  );
}
