import "./AuthCard.css";

export default function AuthCard({ title, children }) {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
