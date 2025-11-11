import { Link } from "react-router";

export default function Login() {
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
      <div
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
            type="text"
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #000",
              backgroundColor: "#fff",
              color: "#000",
              fontSize: "14px",
            }}
            placeholder="usuario@ejemplo.com"
          />
        </div>

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
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #000",
              backgroundColor: "#fff",
              color: "#000",
              fontSize: "14px",
            }}
            placeholder="••••••••"
          />
        </div>

        <Link
          to="/dashboard"
          style={{
            display: "block",
            width: "100%",
            padding: "14px",
            border: "2px solid #000",
            backgroundColor: "#fff",
            color: "#000",
            fontSize: "16px",
            cursor: "pointer",
            textAlign: "center",
            textDecoration: "none",
          }}
        >
          Entrar
        </Link>
      </div>
    </div>
  );
}
