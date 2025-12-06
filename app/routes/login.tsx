import { useState } from "react";
import { useNavigate } from "react-router";
import { loginUser } from "../services/authService";


export default function Login() {
  const navigate = useNavigate();

  // ESTADOS (La memoria del componente)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // LÓGICA
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    setError(null);
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      // Guardamos sesión
      localStorage.setItem("userKey", data.userKey);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userID", data.userID.toString());

      // Redirección
      if (data.tempPassword) {
        navigate("/cambiar-password");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error de conexión");
      }
    } finally {
      setLoading(false);
    }
  };

  // 3. VISTA (JSX)
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
      {/* FORMULARIO DE LOGIN */}
      <form
        onSubmit={handleSubmit}
        style={{
          border: "2px solid #000",
          padding: "40px",
          backgroundColor: "#fff",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h1
          style={{
            color: "#000",
            marginBottom: "30px",
            fontSize: "28px",
            textAlign: "center",
          }}
        >
          Iniciar Sesión
        </h1>

        {/* MENSAJE DE ERROR */}
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
              fontSize: "14px",
            }}
          >
            Correo Electrónico
          </label>
          <input
            type="email" 
            required
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #000",
              backgroundColor: "#fff",
              color: "#000",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
            placeholder="usuario@ejemplo.com"
          />
        </div>

        {/* CAMPO PASSWORD */}
        <div style={{ marginBottom: "30px" }}>
          <label
            style={{
              color: "#000",
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
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
              border: "2px solid #000",
              backgroundColor: "#fff",
              color: "#000",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
            placeholder="••••••••"
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
            border: "2px solid #000",
            backgroundColor: loading ? "#ccc" : "#fff",
            color: "#000",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            textAlign: "center",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          {loading ? "Cargando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}