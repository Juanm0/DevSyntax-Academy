import { useState } from "react";
import "./Input.css";

export default function Input({ label, type, ...props }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword && visible ? "text" : type;

  return (
    <div className="input-group">
      <label>{label}</label>
      <div className={isPassword ? "input-with-toggle" : undefined}>
        <input type={actualType} {...props} />

        {isPassword && (
          <button
            type="button"
            className="toggle-password"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            tabIndex={-1}
          >
            {visible ? "🙈" : "👁️"}
          </button>
        )}
      </div>
    </div>
  );
}
