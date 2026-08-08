import "./Legal.css";

export default function Privacy() {
  return (
    <main className="legal-page">
      <h1>Política de privacidad</h1>
      <p className="legal-updated">
        ⚠️ Texto de referencia — reemplazá estos datos y revisalo con un
        contador/abogado antes de vender en producción, sobre todo si vas
        a tener alumnos en otros países (México, UE, etc.).
      </p>

      <h2>1. Datos que recolectamos</h2>
      <ul>
        <li>Nombre y correo electrónico (registro de cuenta)</li>
        <li>Datos de progreso en los cursos</li>
        <li>Datos de pago, procesados directamente por Stripe (no los vemos ni almacenamos)</li>
      </ul>

      <h2>2. Uso de los datos</h2>
      <p>
        Usamos tus datos para darte acceso a los cursos comprados, enviarte
        comunicaciones relacionadas con tu cuenta y mejorar la plataforma.
      </p>

      <h2>3. Terceros</h2>
      <p>
        Usamos Supabase para autenticación y base de datos, y Stripe para
        procesar pagos. Ambos cuentan con sus propias políticas de
        privacidad.
      </p>

      <h2>4. Tus derechos</h2>
      <p>
        Podés solicitar la eliminación de tu cuenta y datos personales
        escribiendo a contacto@devsyntaxacademy.com.
      </p>
    </main>
  );
}
