import "./Button.css";

export default function Button({ children, ...props }) {
  return (
    <button className="btn-primary" {...props}>
      {children}
    </button>
  );
}
