interface TextAreaProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  rows?: number; // optional: let user set height
}

export default function TextArea({
  value,
  onChange,
  placeholder = "Type your prompt here...",
  className = "",
  style = {},
  onClick,
  rows = 4,
}: TextAreaProps) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onClick={onClick}
      rows={rows}
      className={`w-full p-3 bg-[#D9D9D9]/10 rounded-[8px] text-[12px]
                    placeholder-[#FFFFFF]/40 placeholder:text-[12px]
                    focus:outline-none focus:ring-2 focus:ring-[#D9D9D9]
                    resize-none ${className}`}
      style={style}
    />
  );
}
