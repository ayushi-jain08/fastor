import { useEffect, useRef } from "react";

export default function OtpInput({ value, onChange, length = 6, disabled, invalid }) {
  const refs = useRef([]);

  useEffect(() => {
    refs.current[Math.min(value.length, length - 1)]?.focus();
  }, []);

  const focusBox = (i) => refs.current[Math.max(0, Math.min(i, length - 1))]?.focus();

  const handleChange = (i, e) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (!digits) return;
    const next = (value.slice(0, Math.min(i, value.length)) + digits).slice(0, length);
    onChange(next);
    focusBox(next.length);
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (i < value.length) {
        onChange(value.slice(0, i) + value.slice(i + 1));
        focusBox(i);
      } else if (value.length) {
        onChange(value.slice(0, -1));
        focusBox(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusBox(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusBox(i + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!digits) return;
    onChange(digits);
    focusBox(digits.length);
  };

  const half = length / 2;

  return (
    <div className="otp" role="group" aria-label="6-digit code">
      {Array.from({ length }, (_, i) => (
        <span key={i} className="otp__cell">
          {i === half && <span className="otp__dash" aria-hidden="true">-</span>}
          <input
            ref={(el) => (refs.current[i] = el)}
            className={`otp__box${invalid ? " is-invalid" : ""}`}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={length}
            value={value[i] ?? ""}
            disabled={disabled}
            aria-label={`Digit ${i + 1} of ${length}`}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
          />
        </span>
      ))}
    </div>
  );
}
