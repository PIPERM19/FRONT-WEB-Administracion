import { useState } from "react";
import { useNavigate } from "react-router";
// Importamos las dos funciones clave del servicio de autenticación
import { loginUser, getFreshToken } from "../services/authService"; 

// Definimos el color del borde como una constante para fácil modificación
const BLUE_BORDER_COLOR = "#061B2E"; 

export default function Login() {
  const navigate = useNavigate();

  // ESTADOS (La memoria del componente)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // LÓGICA DE INICIO DE SESIÓN COMPLETA (Mismo que el primer archivo)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError(null);
    setLoading(true);

    try {
      // 1. PRIMER PASO: Obtener userKey, userID y role
      const data = await loginUser({ email, password });

      // 2. Guardamos datos iniciales de sesión
      localStorage.setItem("userKey", data.userKey);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userID", data.userID.toString());

      // 3. SEGUNDO PASO: Obtener el Token de acceso usando el userKey recién guardado
      const freshToken = await getFreshToken(); 

      // 4. GUARDAR EL TOKEN DE ACCESO FINAL
      localStorage.setItem("token", freshToken);

      // 5. Redirección
      if (data.tempPassword) {
        navigate("/cambiar-password");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      // Limpiamos la sesión si falló la autenticación completa
      localStorage.clear(); 
      
      if (err instanceof Error) {
        // Mostramos el mensaje de error de la API (ej: 'Credenciales inválidas')
        setError(err.message);
      } else {
        setError("Error de conexión o respuesta inválida del servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 3. VISTA (JSX) - Diseño Unificado
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          border: `2px solid ${BLUE_BORDER_COLOR}`, // Borde azul
          padding: "40px",
          backgroundColor: "#fff",
          maxWidth: "350px", // Ancho fijo
          width: "100%",
          borderRadius: "10px", // Esquinas redondeadas en formulario
        }}
      >
        <h1
          style={{
            color: "#000",
            marginBottom: "30px",
            fontSize: "24px",
            textAlign: "center",
            fontWeight: "bold",
            textTransform: "uppercase", // Título en mayúsculas
          }}
        >
          INICIO DE SESION
        </h1>

        {/* MENSAJE DE ERROR (Mantiene borde rojo) */}
        {error && (
          <div
            style={{
              border: "2px solid #ff0000",
              color: "#ff0000",
              padding: "10px",
              marginBottom: "20px",
              fontSize: "14px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            ! {error}
          </div>
        )}

        {/* CAMPO EMAIL */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              color: "#000",
              display: "block",
              marginBottom: "8px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Correo Electronico o usuario
          </label>
          <input
            type="email" 
            required
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: `2px solid #000`, 
              backgroundColor: "#fff",
              color: "#000",
              fontSize: "16px",
              boxSizing: "border-box",
              borderRadius: "20px", // Esquinas redondeadas en el input
            }}
          />
        </div>

        {/* CAMPO PASSWORD */}
        <div style={{ marginBottom: "30px" }}>
          <label
            style={{
              color: "#000",
              display: "block",
              marginBottom: "8px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Contraseña
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: `2px solid #000`,
              backgroundColor: "#fff",
              color: "#000",
              fontSize: "16px",
              boxSizing: "border-box",
              borderRadius: "20px", // Esquinas redondeadas en el input
            }}
          />
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          disabled={loading}
          style={{
            display: "block",
            width: "100%",
            padding: "14px",
            border: `2px solid ${BLUE_BORDER_COLOR}`,
            backgroundColor: loading ? "#ccc" : BLUE_BORDER_COLOR, 
            color: loading ? "#000" : "#fff",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            textAlign: "center",
            fontWeight: "bold",
            borderRadius: "50px", // Botón totalmente redondeado
            transition: "all 0.1s ease-in-out",
          }}
        >
          {loading ? "Cargando..." : "INICIAR"}
        </button>
      </form>
    </div>
  );
}