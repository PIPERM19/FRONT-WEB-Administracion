import { useParams } from "react-router";

export default function EquipoDetail() {
  const { id } = useParams();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        color: "#000",
      }}
    >
      <nav
        style={{
          borderBottom: "2px solid #000",
          padding: "20px 40px",
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        <a href="/dashboard" style={{ fontSize: "24px", margin: 0, color: "#000", textDecoration: "none", cursor: "pointer" }}>
          <h1 style={{ fontSize: "24px", margin: 0 }}>PMaster</h1>
        </a>
        <div style={{ display: "flex", gap: "20px", alignItems: "center", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          <a
            href="/proyectos"
            style={{ color: "#000", textDecoration: "none" }}
          >
            Proyectos
          </a>
          <a href="/equipos" style={{ color: "#000", textDecoration: "none" }}>
            Equipos
          </a>
          <a href="/chat" style={{ color: "#000", textDecoration: "none" }}>
            Chat
          </a>
        </div>
        <div>
          <a
            href="/configuracion"
            style={{ color: "#000", textDecoration: "none" }}
          >
            Configuración
          </a>
        </div>
      </nav>

      <div style={{ padding: "40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div>
            <a href="/equipos" style={{ fontSize: "14px", color: "#666", textDecoration: "none", marginBottom: "10px", display: "inline-block" }}>
              ← Volver a Equipos
            </a>
            <h2 style={{ fontSize: "32px", margin: 0 }}>Desarrollo Frontend</h2>
            <p style={{ fontSize: "16px", color: "#666", marginTop: "5px" }}>
              ID: {id}
            </p>
          </div>
        </div>

        <div
          style={{
            border: "2px solid #000",
            padding: "30px",
            backgroundColor: "#fff",
            marginBottom: "40px",
          }}
        >
          <h3 style={{ fontSize: "22px", marginBottom: "20px" }}>
            Información del Equipo
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <p style={{ fontSize: "14px", color: "#666", margin: "0 0 5px 0" }}>
                <strong>Descripción:</strong>
              </p>
              <p style={{ margin: 0 }}>Equipo encargado del desarrollo de interfaces de usuario</p>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#666", margin: "0 0 5px 0" }}>
                <strong>Departamento:</strong>
              </p>
              <p style={{ margin: 0 }}>Desarrollo</p>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#666", margin: "0 0 5px 0" }}>
                <strong>Líder:</strong>
              </p>
              <p style={{ margin: 0 }}>Juan Pérez</p>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#666", margin: "0 0 5px 0" }}>
                <strong>Miembros:</strong>
              </p>
              <p style={{ margin: 0 }}>6 de 10</p>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#666", margin: "0 0 5px 0" }}>
                <strong>Proyectos Activos:</strong>
              </p>
              <p style={{ margin: 0 }}>3</p>
            </div>
          </div>
        </div>

        <div
          style={{
            border: "2px solid #000",
            padding: "30px",
            backgroundColor: "#fff",
            marginBottom: "40px",
          }}
        >
          <h3 style={{ fontSize: "22px", marginBottom: "20px" }}>
            Miembros del Equipo
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <div
              style={{
                border: "2px solid #000",
                padding: "20px",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 5px 0", fontSize: "18px" }}>
                  Juan Pérez
                </h4>
                <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>
                  Líder Técnico
                </p>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Email: juan.perez@example.com
                </div>
              </div>
            </div>

            <div
              style={{
                border: "2px solid #000",
                padding: "20px",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 5px 0", fontSize: "18px" }}>
                  María García
                </h4>
                <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>
                  Desarrollador Senior
                </p>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Email: maria.garcia@example.com
                </div>
              </div>
            </div>

            <div
              style={{
                border: "2px solid #000",
                padding: "20px",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 5px 0", fontSize: "18px" }}>
                  Carlos López
                </h4>
                <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>
                  Desarrollador Junior
                </p>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Email: carlos.lopez@example.com
                </div>
              </div>
            </div>

            <div
              style={{
                border: "2px solid #000",
                padding: "20px",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 5px 0", fontSize: "18px" }}>
                  Ana Martínez
                </h4>
                <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>
                  Desarrollador Senior
                </p>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Email: ana.martinez@example.com
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            border: "2px solid #000",
            padding: "30px",
            backgroundColor: "#fff",
          }}
        >
          <h3 style={{ fontSize: "22px", marginBottom: "20px" }}>
            Proyectos Asignados
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <div
              style={{
                border: "2px solid #000",
                padding: "20px",
                backgroundColor: "#fff",
              }}
            >
              <h4 style={{ margin: "0 0 5px 0", fontSize: "18px" }}>
                Proyecto Alpha
              </h4>
              <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#666" }}>
                Desarrollo de nueva plataforma web
              </p>
              <div style={{ display: "flex", gap: "15px", fontSize: "12px" }}>
                <span>Tareas: 12/25</span>
                <span>Vence: 15/12/2025</span>
              </div>
            </div>

            <div
              style={{
                border: "2px solid #000",
                padding: "20px",
                backgroundColor: "#fff",
              }}
            >
              <h4 style={{ margin: "0 0 5px 0", fontSize: "18px" }}>
                Proyecto Beta
              </h4>
              <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#666" }}>
                Rediseño de API RESTful
              </p>
              <div style={{ display: "flex", gap: "15px", fontSize: "12px" }}>
                <span>Tareas: 8/15</span>
                <span>Vence: 20/12/2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
