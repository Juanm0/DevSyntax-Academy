import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getEnrollmentStatus } from "../services/enrollment.service";
import "./PaymentSuccess.css";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("course");
  const [status, setStatus] = useState("checking"); // checking | paid | pending

  useEffect(() => {
    if (!courseId) return;

    let attempts = 0;

    async function check() {
      const s = await getEnrollmentStatus(courseId);
      attempts += 1;

      if (s === "paid") {
        setStatus("paid");
        return;
      }

      // El webhook de Stripe puede tardar unos segundos en llegar.
      // Reintentamos un rato antes de mostrar "pendiente".
      if (attempts < 8) {
        setTimeout(check, 1500);
      } else {
        setStatus("pending");
      }
    }

    check();
  }, [courseId]);

  return (
    <main className="payment-success">
      {status === "checking" && (
        <>
          <div className="spinner" />
          <h1>Confirmando tu pago...</h1>
          <p>Esto puede tardar unos segundos.</p>
        </>
      )}

      {status === "paid" && (
        <>
          <span className="success-icon">✅</span>
          <h1>¡Pago confirmado!</h1>
          <p>Ya tenés acceso al curso.</p>
          {courseId && (
            <Link to={`/course/${courseId}`} className="course-cta full">
              Ir al curso
            </Link>
          )}
        </>
      )}

      {status === "pending" && (
        <>
          <span className="success-icon">⏳</span>
          <h1>Estamos confirmando tu pago</h1>
          <p>
            Puede tardar un poco más de lo esperado. Si en unos minutos
            no ves el curso desbloqueado, escribinos a{" "}
            <a href="mailto:contacto@devsyntaxacademy.com">
              contacto@devsyntaxacademy.com
            </a>
            .
          </p>
          <Link to="/">Volver al inicio</Link>
        </>
      )}
    </main>
  );
}
