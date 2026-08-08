import "./Legal.css";

export default function Terms() {
  return (
    <main className="legal-page">
      <h1>Términos y condiciones</h1>
      <p className="legal-updated">
        ⚠️ Texto de referencia — reemplazá estos datos y revisalo con un
        contador/abogado antes de vender en producción.
      </p>

      <h2>1. Sobre DevSyntax Academy</h2>
      <p>
        DevSyntax Academy ofrece cursos online pagos sobre desarrollo web
        y contenidos relacionados, dictados de forma total o parcialmente
        en vivo.
      </p>

      <h2>2. Compras y acceso</h2>
      <p>
        Al comprar un curso, el usuario obtiene acceso de por vida al
        contenido publicado en la plataforma para ese curso, sujeto a
        futuras actualizaciones de la academia.
      </p>

      <h2>3. Pagos</h2>
      <p>
        Los pagos se procesan a través de proveedores externos (Stripe).
        DevSyntax Academy no almacena datos de tarjetas de crédito.
      </p>

      <h2>4. Reembolsos</h2>
      <p>
        Definí acá tu política real de reembolsos (por ejemplo: 7 días
        corridos desde la compra si no se accedió a más del 20% del
        contenido).
      </p>

      <h2>5. Propiedad intelectual</h2>
      <p>
        Todo el contenido de los cursos es propiedad de DevSyntax Academy
        y/o sus docentes. Está prohibida su redistribución sin autorización.
      </p>

      <h2>6. Contacto</h2>
      <p>Para consultas: contacto@devsyntaxacademy.com</p>
    </main>
  );
}
