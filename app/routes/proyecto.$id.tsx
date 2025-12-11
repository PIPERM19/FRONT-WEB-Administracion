import { useEffect, useState } from "react";
import { useParams, Link } from "react-router"; // Asegúrate de tener react-router instalado
import { MainLayout } from "../components/main-layout";

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
    return(
      <MainLayout fullWidth>
        <div className="py-10 text-center text-lg">Cargando datos del proyecto...</div>
      </MainLayout>
    ) 
  }

  if (!project) {
    return(
      <MainLayout fullWidth>
        <div className="py-10 text-center">Proyecto no encontrado.</div>
      </MainLayout>
    ) 
  }

  return (
    <MainLayout fullWidth>
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* HEADER DEL PROYECTO */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link to="/proyectos" className="text-sm text-neutral-600 font-bold">
              ← Volver a Proyectos
            </Link>

            {/* CAMBIO: mostrar nombre e ID correctamente */}
            <h2 className="mt-2 text-4xl font-extrabold">{project.name}</h2>
            <span className="mt-2 inline-block text-xs font-mono bg-neutral-100 px-2 py-1 border border-black">
              ID: {project.id}
            </span>
          </div>
        </div>

        {/* INFORMACIÓN DEL PROYECTO */}
        <div className="mb-8 border-2 border-black p-8 bg-white shadow-[8px_8px_0_rgba(0,0,0,1)]">
          <h3 className="mb-4 text-lg font-bold uppercase">Información General</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <p className="text-sm font-bold text-neutral-600 uppercase mb-1">Descripción</p>
              <p className="text-base">{project.description}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-600 uppercase mb-1">Fecha de Inicio</p>
              <p className="text-lg">{formatDate(project.start)}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-600 uppercase mb-1">Fecha de Entrega</p>
              <p className="text-lg">{formatDate(project.end)}</p>
            </div>
          </div>
        </div>

        {/* LISTA DE ACTIVIDADES */}
        <div className="border-2 border-black p-8 bg-white">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold uppercase">Lista de Actividades</h3>

            {/* CAMBIO: contar tareas correctamente */}
            <span className="font-bold border-2 border-black px-3 py-1 rounded-full">
              {tasks.length} Tareas
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="p-10 text-center border-2 border-dashed text-neutral-500">
              No hay tareas registradas.
            </div>
          ) : (
            <div className="flex flex-col gap-4">

              {/* CAMBIO: renderizar con labels correctos */}
              {tasks.map((task) => (
                <div key={task.id} className="flex justify-between items-center border-2 border-black p-4">
                  
                  <div>
                    <div className="font-bold text-lg">{task.title}</div>
                    <div className="text-sm text-neutral-600">
                      {task.description || "Sin descripción"}
                    </div>
                  </div>

                  <div className="flex gap-6 items-center">
                    
                    <div className="text-right">
                      <div className="text-xs uppercase font-bold text-neutral-500">Prioridad</div>
                      <div className="font-bold">{getPriorityLabel(task.priority)}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs uppercase font-bold text-neutral-500">Estado</div>

                      <span className={`inline-block px-3 py-1 border 
                        ${task.status === "3" ? "bg-black text-white" : ""}
                      `}>
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