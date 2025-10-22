interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  type?: string;
}

export default function Input({
  value,
  onChange,
  placeholder = "Type here...",
  className = "",
  style = {},
  onClick,
  type = "text",
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onClick={onClick}
      className={`w-[500px] h-[55px] p-3 bg-transparent rounded-[6px] text-[12px]
                    placeholder-[#9794AA]/40 placeholder:text-[16px] placeholder:font-semibold
                    border border-[#9794AA]
                    ${className}`}
      style={style}
    />
  );
}
