import { useState } from "react";
import "./Input.css";

function EyeIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.64-7 10-7 10 7 10 7-3.64 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c6.36 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61C3.06 8.83 2 12 2 12s3.64 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

export default function Input({ label, type, id, name, ...props }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword && visible ? "text" : type;

  const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="input-group">
      <label htmlFor={inputId}>{label}</label>
      <div className={isPassword ? "input-with-toggle" : undefined}>
        <input id={inputId} name={name || inputId} type={actualType} {...props} />

        {isPassword && (
          <button
            type="button"
            className="toggle-password"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            tabIndex={-1}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
    </div>
  );
}
