import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "../components/main-layout";

import { 
  getProjects, 
  getProjectModules, 
  getModuleTasks 
} from "../services/projectService";

import type { Project, Task } from "../types/projects";

// --- CONSTANTES DE DISEÑO ---
const CUSTOM_BLUE = "#0D3B66";
const SHADOW_BLUE = "shadow-lg shadow-[rgba(13,59,102,0.2)]";

export default function ProyectoDetail() {

  const { id } = useParams<{ id: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadData(id);
  }, [id]);

  const loadData = async (projectId: string) => {
    try {
      setLoading(true);

      const allProjects = await getProjects();
      const foundProject = allProjects.find(p => p.id === projectId);
      setProject(foundProject || null);

      if (foundProject) {
        const modules = await getProjectModules(projectId);

        const tasksPromises = modules.map(module =>
          getModuleTasks(projectId, module.id)
        );

        const results = await Promise.all(tasksPromises);
        const allTasks = results.flat();
        setTasks(allTasks);
      }

    } catch (error) {
      console.error("Error cargando detalles", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusLabel = (status: string) => {
    if (status === "1") return "Pendiente";
    if (status === "2") return "En Progreso";
    return "Completada";
  };

  const getStatusColorClass = (status: string) => {
    if (status === "1") return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (status === "2") return "bg-blue-100 text-blue-800 border-blue-300";
    return "bg-green-100 text-green-800 border-green-300";
  };

  const getPriorityLabel = (priority: string) => {
    if (priority === "1") return "Alta";
    if (priority === "2") return "Media";
    return "Baja";
  };

  const getPriorityColorClass = (priority: string) => {
    if (priority === "1") return "text-red-600 font-bold";
    if (priority === "2") return "text-orange-500 font-semibold";
    return "text-green-500";
  };

  // --- RENDERIZADO ---
  if (loading) {
    return (
      <MainLayout fullWidth>
        <div className="py-10 text-center text-lg">Cargando datos del proyecto...</div>
      </MainLayout>
    );
  }

  if (!project) {
    return (
      <MainLayout fullWidth>
        <div className="py-10 text-center">Proyecto no encontrado.</div>
      </MainLayout>
    );
  }

  // --- RENDER PRINCIPAL ---
  return (
    <MainLayout fullWidth>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 border-b border-neutral-200 pb-4">
          <div>
            <Link 
              to="/proyectos"
              className="text-sm text-neutral-500 hover:text-neutral-900 font-semibold"
            >
              ← Volver a Proyectos
            </Link>

            <h2 className="text-4xl sm:text-5xl font-extrabold mt-1 mb-2" style={{ color: CUSTOM_BLUE }}>
              {project.name}
            </h2>

            <span className="text-xs font-mono bg-neutral-100 px-2 py-1 border border-neutral-300 rounded text-neutral-600">
              ID: {project.id}
            </span>
          </div>
        </div>

        {/* INFORMACIÓN GENERAL */}
        <div
          className={`bg-white p-6 md:p-8 mb-10 border-2 rounded-xl ${SHADOW_BLUE}`}
          style={{ borderColor: CUSTOM_BLUE }}
        >
          <h3 className="text-xl font-bold uppercase mb-4 text-neutral-700 border-b border-neutral-200 pb-2">
            Información General
          </h3>

          <div className="grid md:grid-cols-4 gap-6">

            <div className="md:col-span-4">
              <p className="text-xs text-neutral-500 uppercase font-bold mb-1">Descripción</p>
              <p className="text-base text-neutral-800">{project.description}</p>
            </div>

            <div>
              <p className="text-xs text-neutral-500 uppercase font-bold mb-1">Fecha de Inicio</p>
              <span className="text-lg font-semibold bg-neutral-100 px-3 py-1 rounded">
                {formatDate(project.start)}
              </span>
            </div>

            <div>
              <p className="text-xs text-neutral-500 uppercase font-bold mb-1">Fecha de Entrega</p>
              <span className="text-lg font-semibold bg-neutral-100 px-3 py-1 rounded">
                {formatDate(project.end)}
              </span>
            </div>

          </div>
        </div>

        {/* LISTA DE ACTIVIDADES */}
        <div
          className={`bg-white p-6 md:p-8 border-2 rounded-xl`}
          style={{ borderColor: CUSTOM_BLUE }}
        >
          <div className="flex justify-between items-center mb-6 border-b border-neutral-200 pb-4">
            <h3 className="text-xl font-bold uppercase" style={{ color: CUSTOM_BLUE }}>
              Lista de Actividades
            </h3>

            <span
              className="font-bold border px-3 py-1 rounded-full text-sm"
              style={{ borderColor: CUSTOM_BLUE, color: CUSTOM_BLUE }}
            >
              {tasks.length} Tareas
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="py-10 text-center border-2 border-dashed border-neutral-300 text-neutral-500 rounded-lg bg-neutral-50">
              No hay tareas registradas en los módulos de este proyecto.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-neutral-200 bg-white hover:bg-neutral-50 transition-all rounded-lg shadow-sm"
                >
                  <div className="flex-1 mb-3 sm:mb-0">
                    <div className="font-semibold text-lg text-neutral-800">
                      {task.title}
                    </div>
                    <div className="text-sm text-neutral-500 mt-1">
                      {task.description || "Sin descripción"}
                    </div>
                  </div>

                  <div className="flex gap-6 items-center">

                    <div className="text-right">
                      <div className="text-xs uppercase text-neutral-400">Prioridad</div>
                      <div className={`text-sm ${getPriorityColorClass(task.priority)}`}>
                        {getPriorityLabel(task.priority)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs uppercase text-neutral-400">Estado</div>
                      <span
                        className={`inline-block border text-xs font-semibold px-2 py-1 rounded-full ${getStatusColorClass(task.status)}`}
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
    </MainLayout>
  );
}
