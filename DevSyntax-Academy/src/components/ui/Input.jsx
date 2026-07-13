import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import "./Input.css";


export default function Input({
  label,
  type = "text",
  id,
  name,
  ...props
}) {
  const [visible, setVisible] = useState(false);

  const isPassword = type === "password";

  const inputId =
    id ||
    name ||
    (label
      ? label.toLowerCase().replace(/\s+/g, "-")
      : undefined);

  return (
    <div className="input-group">

      {label && (
        <label htmlFor={inputId}>{label}</label>
      )}

      <div className="input-wrapper">

        <input
          id={inputId}
          name={name || inputId}
          type={isPassword && visible ? "text" : type}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className="toggle-password"
            onClick={() => setVisible((v) => !v)}
            aria-label={
              visible
                ? "Ocultar contraseña"
                : "Mostrar contraseña"
            }
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

      </div>

    </div>
  );
}