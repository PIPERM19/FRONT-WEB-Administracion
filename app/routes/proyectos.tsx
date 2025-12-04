import { useState, useEffect } from "react";
import { Link } from "react-router";
import { MainLayout } from "../components/main-layout";

import { 
  getProjects, 
  createProject, 
  getProjectModules, 
  createTask 
} from "../services/projectService";
import type { Project, Module } from "../types/projects";

export default function Proyectos() {
  // ESTADOS PRINCIPALES
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  // MODALES (CREAR PROYECTO / TAREA)
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // FORMULARIOS PROYECTO
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  //  FORMULARIO TAREA
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [availableModules, setAvailableModules] = useState<Module[]>([]);

  // CARGAR PROYECTOS AL INICIAR
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("userID");
    
    setRole(storedRole);
    if (storedUserId) setUserId(parseInt(storedUserId));

    loadProjects();
  }, []);

  // Función para cargar proyectos
  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error cargando proyectos", error);
    }
  };

  // Cargar módulos al elegir proyecto
  const handleProjectSelect = async (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedModuleId(null); 
    try {
      const modules = await getProjectModules(projectId);
      setAvailableModules(modules);
    } catch (error) {
      console.error("Error cargando módulos", error);
    }
  };

  // CREAR PROYECTO
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      await createProject({
        name: newProjectName,
        description: newProjectDesc,
        client_id: 2,           // Estático según requerimiento
        team_leader_id: userId, // Usuario actual
        start: new Date(startDate).toISOString(),
        end: new Date(endDate).toISOString(), 
      });

      setShowProjectModal(false);
      loadProjects(); 
      alert("Proyecto creado con éxito");
      
      // Reset
      setNewProjectName("");
      setNewProjectDesc("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      alert("Error al crear proyecto");
      console.error(error);
    }
  };

  // CREAR TAREA
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !selectedModuleId) {
      alert("Selecciona proyecto y módulo");
      return;
    }

    try {
      await createTask(
        selectedProjectId,
        selectedModuleId,
        taskTitle,
        taskDesc,
        "1", "1", userId || undefined 
      );
      setShowTaskModal(false);
      alert("Tarea creada con éxito");
      setTaskTitle("");
      setTaskDesc("");
    } catch (error) {
      alert("Error al crear tarea");
    }
  };

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    if (!dateString) return "Pendiente";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };
  
  const todayStr = new Date().toISOString().split("T")[0];

  // Permisos de edición (rol 0 y 1)
  const canEdit = role === "0" || role === "1";

  return (
    <MainLayout contentClassName="flex flex-col gap-10 relative">
      <header className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold">Proyectos</h1>
          <p className="mt-1 text-sm text-neutral-600">
            {canEdit 
              ? "Visualiza y gestiona todos los proyectos activos de PMaster." 
              : "Visualiza los proyectos a los que has sido asignado."}
          </p>
        </div>
        
        {/* BOTÓN DE ACCIONES (SOLO ADMIN) */}
        {canEdit && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowActionsMenu((state) => !state)}
              className="border-2 border-black bg-white px-6 py-3 text-sm font-semibold transition-colors hover:bg-black hover:text-white"
            >
              Acciones ▼
            </button>
            {showActionsMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 border-2 border-black bg-white shadow-lg z-10">
                <button
                  type="button"
                  onClick={() => {
                    setShowActionsMenu(false);
                    setShowProjectModal(true);
                  }}
                  className="w-full border-b-2 border-black px-4 py-3 text-left text-sm font-medium hover:bg-neutral-100"
                >
                  Crear nuevo proyecto
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowActionsMenu(false);
                    setShowTaskModal(true);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-medium hover:bg-neutral-100"
                >
                  Añadir tarea a proyecto
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* LISTA DE PROYECTOS */}
      {projects.length === 0 ? (
         <div className="py-12 text-center border-2 border-dashed border-gray-300 text-neutral-500">
           No se encontraron proyectos activos.
         </div>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/proyecto/${project.id}`}
              className="flex flex-col border-2 border-black bg-white p-6 transition-transform hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold truncate pr-2">{project.name}</h2>
                <span className="text-[10px] font-mono border border-black px-1 bg-gray-100">
                  #{project.id}
                </span>
              </div>
              
              <p className="mt-2 text-sm text-neutral-600 line-clamp-3 mb-4 flex-grow">
                {project.description}
              </p>
              
              <div className="mt-auto border-t border-gray-100 pt-3">
                <div className="flex justify-between text-xs font-medium text-neutral-500">
                  <div className="flex flex-col">
                    <span className="uppercase tracking-wider text-[10px]">Inicio</span>
                    <span className="text-black">{formatDate(project.start)}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="uppercase tracking-wider text-[10px]">Fin</span>
                    <span className="text-black">{formatDate(project.end)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* MODAL CREAR PROYECTO */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <form onSubmit={handleCreateProject} className="w-full max-w-lg border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="mb-6 text-2xl font-bold uppercase">Nuevo Proyecto</h2>
            
            <div className="mb-4">
              <label className="block font-bold mb-2">Nombre</label>
              <input className="w-full border-2 border-black p-3" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} required />
            </div>
            
            <div className="mb-4">
              <label className="block font-bold mb-2">Descripción</label>
              <textarea className="w-full border-2 border-black p-3" rows={3} value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block font-bold mb-2">Inicio</label>
                <input type="date" className="w-full border-2 border-black p-3" value={startDate} min={todayStr} onChange={e => setStartDate(e.target.value)} required />
              </div>
              <div>
                <label className="block font-bold mb-2">Fin</label>
                <input type="date" className="w-full border-2 border-black p-3" value={endDate} min={startDate || todayStr} onChange={e => setEndDate(e.target.value)} required />
              </div>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => setShowProjectModal(false)} className="flex-1 border-2 border-black py-3 font-bold hover:bg-neutral-200">CANCELAR</button>
              <button type="submit" className="flex-1 border-2 border-black bg-black py-3 text-white font-bold hover:bg-white hover:text-black">GUARDAR</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL CREAR TAREA */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <form onSubmit={handleCreateTask} className="w-full max-w-lg border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="mb-6 text-2xl font-bold uppercase">Nueva Tarea</h2>
            <div className="mb-4">
              <label className="block font-bold mb-2">Proyecto</label>
              <select className="w-full border-2 border-black p-3 bg-white" value={selectedProjectId} onChange={(e) => handleProjectSelect(e.target.value)} required>
                <option value="">-- Selecciona --</option>
                {projects.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-2">Módulo</label>
              <select className="w-full border-2 border-black p-3 bg-white disabled:bg-gray-200" value={selectedModuleId || ""} onChange={(e) => setSelectedModuleId(Number(e.target.value))} required disabled={!selectedProjectId}>
                <option value="">-- Selecciona --</option>
                {availableModules.map(m => (<option key={m.id} value={m.id}>{m.title}</option>))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-2">Título</label>
              <input className="w-full border-2 border-black p-3" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} required />
            </div>
            <div className="mb-6">
              <label className="block font-bold mb-2">Descripción</label>
              <textarea className="w-full border-2 border-black p-3" rows={2} value={taskDesc} onChange={e => setTaskDesc(e.target.value)} />
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 border-2 border-black py-3 font-bold hover:bg-neutral-200">CANCELAR</button>
              <button type="submit" className="flex-1 border-2 border-black bg-black py-3 text-white font-bold hover:bg-white hover:text-black">GUARDAR</button>
            </div>
          </form>
        </div>
      )}
    </MainLayout>
  );
}