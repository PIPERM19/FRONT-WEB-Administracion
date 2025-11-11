import { useParams } from "react-router";

export default function ProyectoDetail() {
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
            <a href="/proyectos" style={{ fontSize: "14px", color: "#666", textDecoration: "none", marginBottom: "10px", display: "inline-block" }}>
              ← Volver a Proyectos
            </a>
            <h2 style={{ fontSize: "32px", margin: 0 }}>Proyecto Alpha</h2>
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
            Información del Proyecto
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <p style={{ fontSize: "14px", color: "#666", margin: "0 0 5px 0" }}>
                <strong>Descripción:</strong>
              </p>
              <p style={{ margin: 0 }}>Desarrollo de nueva plataforma web</p>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#666", margin: "0 0 5px 0" }}>
                <strong>Equipo Asignado:</strong>
              </p>
              <p style={{ margin: 0 }}>Frontend</p>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#666", margin: "0 0 5px 0" }}>
                <strong>Fecha de Inicio:</strong>
              </p>
              <p style={{ margin: 0 }}>01/12/2025</p>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#666", margin: "0 0 5px 0" }}>
                <strong>Fecha de Entrega:</strong>
              </p>
              <p style={{ margin: 0 }}>15/12/2025</p>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#666", margin: "0 0 5px 0" }}>
                <strong>Tareas Completadas:</strong>
              </p>
              <p style={{ margin: 0 }}>12 de 25</p>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#666", margin: "0 0 5px 0" }}>
                <strong>Prioridad:</strong>
              </p>
              <p style={{ margin: 0 }}>Alta</p>
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
            Tablero Kanban
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
            }}
          >
            <div>
              <div
                style={{
                  border: "2px solid #000",
                  padding: "10px",
                  marginBottom: "15px",
                  backgroundColor: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Por Hacer
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    border: "2px solid #000",
                    padding: "15px",
                    backgroundColor: "#fff",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      marginBottom: "5px",
                      fontSize: "14px",
                    }}
                  >
                    Diseñar interfaz de usuario
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginBottom: "8px",
                    }}
                  >
                    Asignado a: Juan Pérez
                  </div>
                  <div style={{ fontSize: "11px", color: "#666" }}>
                    Prioridad: Alta
                  </div>
                </div>

                <div
                  style={{
                    border: "2px solid #000",
                    padding: "15px",
                    backgroundColor: "#fff",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      marginBottom: "5px",
                      fontSize: "14px",
                    }}
                  >
                    Configurar servidor
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginBottom: "8px",
                    }}
                  >
                    Asignado a: María García
                  </div>
                  <div style={{ fontSize: "11px", color: "#666" }}>
                    Prioridad: Media
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div
                style={{
                  border: "2px solid #000",
                  padding: "10px",
                  marginBottom: "15px",
                  backgroundColor: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                En Progreso
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    border: "2px solid #000",
                    padding: "15px",
                    backgroundColor: "#fff",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      marginBottom: "5px",
                      fontSize: "14px",
                    }}
                  >
                    Desarrollar API REST
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginBottom: "8px",
                    }}
                  >
                    Asignado a: Carlos López
                  </div>
                  <div style={{ fontSize: "11px", color: "#666" }}>
                    Prioridad: Alta
                  </div>
                </div>

                <div
                  style={{
                    border: "2px solid #000",
                    padding: "15px",
                    backgroundColor: "#fff",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      marginBottom: "5px",
                      fontSize: "14px",
                    }}
                  >
                    Escribir documentación
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginBottom: "8px",
                    }}
                  >
                    Asignado a: Ana Martínez
                  </div>
                  <div style={{ fontSize: "11px", color: "#666" }}>
                    Prioridad: Baja
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div
                style={{
                  border: "2px solid #000",
                  padding: "10px",
                  marginBottom: "15px",
                  backgroundColor: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                En Revisión
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    border: "2px solid #000",
                    padding: "15px",
                    backgroundColor: "#fff",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      marginBottom: "5px",
                      fontSize: "14px",
                    }}
                  >
                    Pruebas unitarias
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginBottom: "8px",
                    }}
                  >
                    Asignado a: Luis Rodríguez
                  </div>
                  <div style={{ fontSize: "11px", color: "#666" }}>
                    Prioridad: Media
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div
                style={{
                  border: "2px solid #000",
                  padding: "10px",
                  marginBottom: "15px",
                  backgroundColor: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Completado
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    border: "2px solid #000",
                    padding: "15px",
                    backgroundColor: "#fff",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      marginBottom: "5px",
                      fontSize: "14px",
                    }}
                  >
                    Configurar repositorio
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginBottom: "8px",
                    }}
                  >
                    Asignado a: Carmen Díaz
                  </div>
                  <div style={{ fontSize: "11px", color: "#666" }}>
                    Completada
                  </div>
                </div>

                <div
                  style={{
                    border: "2px solid #000",
                    padding: "15px",
                    backgroundColor: "#fff",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      marginBottom: "5px",
                      fontSize: "14px",
                    }}
                  >
                    Definir arquitectura
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginBottom: "8px",
                    }}
                  >
                    Asignado a: Juan Pérez
                  </div>
                  <div style={{ fontSize: "11px", color: "#666" }}>
                    Completada
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
