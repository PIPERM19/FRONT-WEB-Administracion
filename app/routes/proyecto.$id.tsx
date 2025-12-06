import { useEffect, useState } from "react";
import { useParams, Link } from "react-router"; // Asegúrate de tener react-router instalado

import { 
  getProjects, 
  getProjectModules, 
  getModuleTasks 
} from "../services/projectService";
import type { Project, Task } from "../types/projects";

export default function ProyectoDetail() {
  const { id } = useParams(); // Obtenemos el ID de la URL
  
  // ESTADOS 
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // CARGA DE DATOS
  useEffect(() => {
    if (id) loadData(id);
  }, [id]);

  const loadData = async (projectId: string) => {
    try {
      setLoading(true);

      // Obtener Info del Proyecto
      // (Como no hay endpoint individual, traemos todos y buscamos el correcto) (Preguntar a backend si se puede crear uno)
      const allProjects = await getProjects();
      const foundProject = allProjects.find(p => p.id === projectId);
      setProject(foundProject || null);

      if (foundProject) {
        // Obtener Módulos del Proyecto
        const modules = await getProjectModules(projectId);

        // Obtener Tareas de CADA Módulo
        const tasksPromises = modules.map(module => 
          getModuleTasks(projectId, module.id)
        );
        
        // Esperamos a que todas las peticiones terminen
        const results = await Promise.all(tasksPromises);
        
        // Aplanamos el array de arrays en uno solo
        const allTasks = results.flat();
        setTasks(allTasks);
      }

    } catch (error) {
      console.error("Error cargando detalles", error);
    } finally {
      setLoading(false);
    }
  };

  // HELPERS VISUALES
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const getStatusLabel = (status: string) => {
    // Ajusta estos valores según tu lógica de negocio real
    if (status === "1") return "Pendiente";
    if (status === "2") return "En Progreso";
    return "Completada";
  };

  const getPriorityLabel = (priority: string) => {
    if (priority === "1") return "Alta";
    if (priority === "2") return "Media";
    return "Baja";
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", fontSize: "20px" }}>Cargando datos del proyecto...</div>;
  }

  if (!project) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Proyecto no encontrado.</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        color: "#000",
        fontFamily: "system-ui, sans-serif"
      }}
    >
      {/* --- NAVEGACIÓN --- */}
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
        <Link to="/dashboard" style={{ textDecoration: "none", color: "#000" }}>
          <h1 style={{ fontSize: "24px", margin: 0, fontWeight: "900", letterSpacing: "-1px" }}>PMaster</h1>
        </Link>
        <div style={{ display: "flex", gap: "20px", alignItems: "center", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          <Link to="/proyectos" style={{ color: "#000", textDecoration: "none", fontWeight: "600" }}>Proyectos</Link>
          <Link to="/equipos" style={{ color: "#000", textDecoration: "none", fontWeight: "600" }}>Equipos</Link>
          <Link to="/chat" style={{ color: "#000", textDecoration: "none", fontWeight: "600" }}>Chat</Link>
        </div>
        <div>
          <Link to="/configuracion" style={{ color: "#000", textDecoration: "none", fontWeight: "600" }}>Configuración</Link>
        </div>
      </nav>

      <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* HEADER DEL PROYECTO */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div>
            <Link to="/proyectos" style={{ fontSize: "14px", color: "#666", textDecoration: "none", marginBottom: "10px", display: "inline-block", fontWeight: "bold" }}>
              ← Volver a Proyectos
            </Link>
            <h2 style={{ fontSize: "42px", margin: "10px 0 0 0", fontWeight: "800" }}>{project.name}</h2>
            <span style={{ fontSize: "12px", fontFamily: "monospace", backgroundColor: "#eee", padding: "4px 8px", border: "1px solid #000" }}>
              ID: {project.id}
            </span>
          </div>
        </div>

        {/* INFORMACIÓN DEL PROYECTO */}
        <div
          style={{
            border: "2px solid #000",
            padding: "30px",
            backgroundColor: "#fff",
            marginBottom: "40px",
            boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)"
          }}
        >
          <h3 style={{ fontSize: "22px", marginBottom: "20px", fontWeight: "bold", textTransform: "uppercase" }}>
            Información General
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={{ gridColumn: "span 2" }}>
              <p style={{ fontSize: "12px", color: "#666", margin: "0 0 5px 0", textTransform: "uppercase", fontWeight: "bold" }}>
                Descripción
              </p>
              <p style={{ margin: 0, fontSize: "16px" }}>{project.description}</p>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "#666", margin: "0 0 5px 0", textTransform: "uppercase", fontWeight: "bold" }}>
                Fecha de Inicio
              </p>
              <p style={{ margin: 0, fontSize: "18px" }}>{formatDate(project.start)}</p>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "#666", margin: "0 0 5px 0", textTransform: "uppercase", fontWeight: "bold" }}>
                Fecha de Entrega
              </p>
              <p style={{ margin: 0, fontSize: "18px" }}>{formatDate(project.end)}</p>
            </div>
          </div>
        </div>

        {/* LISTA DE ACTIVIDADES */}
        <div
          style={{
            border: "2px solid #000",
            padding: "30px",
            backgroundColor: "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "22px", margin: 0, fontWeight: "bold", textTransform: "uppercase" }}>
              Lista de Actividades
            </h3>
            <span style={{ fontWeight: "bold", border: "2px solid #000", padding: "5px 10px", borderRadius: "20px" }}>
              {tasks.length} Tareas
            </span>
          </div>

          {tasks.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", border: "2px dashed #ccc", color: "#888" }}>
              No hay tareas registradas en los módulos de este proyecto.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "2px solid #000",
                    padding: "20px",
                    backgroundColor: "#fff",
                    transition: "transform 0.1s",
                    cursor: "default"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "5px" }}>
                      {task.title}
                    </div>
                    <div style={{ fontSize: "14px", color: "#666" }}>
                      {task.description || "Sin descripción"}
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "10px", textTransform: "uppercase", fontWeight: "bold", color: "#888" }}>Prioridad</div>
                      <div style={{ fontWeight: "bold" }}>{getPriorityLabel(task.priority)}</div>
                    </div>
                    
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "10px", textTransform: "uppercase", fontWeight: "bold", color: "#888" }}>Estado</div>
                      <span 
                        style={{ 
                          display: "inline-block",
                          backgroundColor: task.status === "3" ? "#000" : "#fff", // Asumiendo 3 es completado
                          color: task.status === "3" ? "#fff" : "#000",
                          border: "1px solid #000",
                          padding: "2px 8px",
                          fontSize: "12px",
                          fontWeight: "bold"
                        }}
                      >
                        {getStatusLabel(task.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
