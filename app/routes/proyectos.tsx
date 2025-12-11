import { useState, useEffect } from "react";
import { Link } from "react-router"; 
import { MainLayout } from "../components/main-layout";

import { 
  getProjects, 
  createProject, 
  getProjectModules, 
  createTask,
  removeProyect
} from "../services/projectService";
import type { Project, Module } from "../types/projects";

// --- CONSTANTES DE DISEÑO (Adaptadas al estilo solicitado: Azul oscuro y bordes sólidos) ---
const CUSTOM_BLUE = "#0D3B66"; // El color azul oscuro 
const RED_COLOR = "#dc2626"; // Rojo para la acción de eliminar
const BORDER_CLASS = "border-2 rounded-lg";

// Usamos clases dinámicas de Tailwind JIT para asegurar que el foco funcione correctamente
// Nota: La sintaxis [${COLOR}] solo funciona si Tailwind puede pre-analizar el valor.
const INPUT_CLASSES = `w-full border-2 border-neutral-300 p-3 rounded-lg focus:outline-none focus:border-[${CUSTOM_BLUE}] transition-colors`;

const BLUE_BUTTON_STYLE = { backgroundColor: CUSTOM_BLUE, borderColor: CUSTOM_BLUE, color: 'white' };
const HOVER_BLUE_BUTTON_STYLE = { backgroundColor: 'white', color: CUSTOM_BLUE, borderColor: CUSTOM_BLUE };
const RED_BUTTON_STYLE = { backgroundColor: RED_COLOR, borderColor: RED_COLOR, color: 'white' };
const HOVER_RED_BUTTON_STYLE = { backgroundColor: 'white', color: RED_COLOR, borderColor: RED_COLOR };

const CANCEL_BUTTON_CLASSES = `flex-1 border-2 border-neutral-300 py-3 font-bold hover:bg-neutral-100 rounded-lg text-neutral-700`;
const MODAL_CONTAINER_CLASSES = `w-full max-w-lg bg-white p-8 ${BORDER_CLASS}`;


export default function Proyectos() {
  // --- ESTADOS ---
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  // Modales
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);

  // Formulario: Proyecto
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Formulario: Tarea / Eliminación
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [projectToDelete, setProjectToDelete] = useState<string>("");

  // --- EFECTOS ---
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("userID");
    
    setRole(storedRole);
    if (storedUserId) setUserId(parseInt(storedUserId));

    loadProjects();
  }, []);

  // --- FUNCIONES DE CARGA ---
  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error cargando proyectos", error);
    }
  };

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

  // --- HANDLERS (ACCIONES) ---

  // 1. Crear Proyecto
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      await createProject({
        name: newProjectName,
        description: newProjectDesc,
        client_id: 2,           // Estático según requerimiento
        team_leader_id: userId, // Usuario actual
        start: new Date(startDate).toISOString(),
        end: new Date(endDate).toISOString(), 
      });

      setShowProjectModal(false);
      loadProjects(); 
      alert("Proyecto creado con éxito");
      
      // Reset form
      setNewProjectName("");
      setNewProjectDesc("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      alert("Error al crear proyecto");
      console.error(error);
    }
  };

  // 2. Crear Tarea
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

  // 3. Eliminar Proyecto
  const handleDeleteProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectToDelete) {
      alert("Selecciona un proyecto para eliminar");
      return;
    }
    try {
      await removeProyect(projectToDelete);
      setShowDeleteProjectModal(false);
      loadProjects();
      alert("Proyecto eliminado con éxito");
      setProjectToDelete("");
    } catch (error) {
      alert("Error al eliminar el proyecto");
      console.error("Error eliminando proyecto", error);
    }
  };

  // --- UTILIDADES ---
  const formatDate = (dateString: string) => {
    if (!dateString) return "Pendiente";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };
  
  const todayStr = new Date().toISOString().split("T")[0];
  const canEdit = role === "0" || role === "1";

  // --- RENDER ---
  return (
    <MainLayout contentClassName="flex flex-col gap-10 relative p-4 sm:p-6 lg:p-8">
      
      {/* HEADER */}
      <header className="flex items-center justify-between gap-6">
        <div>
          <h1 className={`text-3xl font-extrabold`} style={{ color: CUSTOM_BLUE }}>
            Proyectos
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            {canEdit 
              ? "Visualiza y gestiona todos los proyectos activos de PMaster." 
              : "Visualiza los proyectos a los que has sido asignado."}
          </p>
        </div>
        
        {/* BOTÓN DE ACCIONES (DROPDOWN) */}
        {canEdit && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowActionsMenu((state) => !state)}
              className={`px-6 py-3 text-sm font-semibold transition-colors rounded-lg shadow-md ${BORDER_CLASS}`}
              style={showActionsMenu ? HOVER_BLUE_BUTTON_STYLE : BLUE_BUTTON_STYLE}
              onMouseEnter={(e) => e.currentTarget.style.cssText = `background-color: white; color: ${CUSTOM_BLUE}; border-color: ${CUSTOM_BLUE}; border-width: 2px; border-radius: 0.5rem;`}
              onMouseLeave={(e) => {
                if (!showActionsMenu) {
                  e.currentTarget.style.cssText = `background-color: ${CUSTOM_BLUE}; color: white; border-color: ${CUSTOM_BLUE}; border-width: 2px; border-radius: 0.5rem;`;
                }
              }}
            >
              ACCIONES
            </button>
            
            {showActionsMenu && (
              <div className={`absolute right-0 top-full mt-2 w-64 border border-neutral-300 bg-white shadow-xl z-20 rounded-lg overflow-hidden`}>
                <button
                  type="button"
                  onClick={() => { setShowActionsMenu(false); setShowProjectModal(true); }}
                  className={`w-full px-4 py-3 text-left text-sm font-medium hover:bg-neutral-50 border-b border-neutral-100 transition-colors`}
                  style={{ color: CUSTOM_BLUE }}
                >
                  Crear nuevo proyecto
                </button>
                <button
                  type="button"
                  onClick={() => { setShowActionsMenu(false); setShowTaskModal(true); }}
                  className={`w-full px-4 py-3 text-left text-sm font-medium hover:bg-neutral-50 border-b border-neutral-100 transition-colors`}
                  style={{ color: CUSTOM_BLUE }}
                >
                  Añadir tarea a proyecto
                </button>
                <button
                  type="button"
                  onClick={() => { setShowActionsMenu(false); setShowDeleteProjectModal(true); }}
                  className="w-full px-4 py-3 text-left text-sm font-medium hover:bg-red-50 text-red-600 transition-colors"
                >
                  Eliminar proyecto
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      ***

      {/* GRID DE PROYECTOS */}
      {projects.length === 0 ? (
          <div className={`py-16 text-center border-2 border-dashed border-neutral-300 text-neutral-500 rounded-xl bg-neutral-50`}>
            No se encontraron proyectos activos.
          </div>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/proyecto/${project.id}`}
              className={`flex flex-col bg-white p-6 rounded-xl transition-all hover:-translate-y-1 hover:shadow-2xl ${BORDER_CLASS}`}
              style={{ borderColor: CUSTOM_BLUE }}
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className={`text-xl font-bold truncate pr-2`} style={{ color: CUSTOM_BLUE }}>
                  {project.name}
                </h2>
                <span className="text-[10px] font-mono border px-2 py-0.5 bg-neutral-100 rounded text-neutral-500" style={{ borderColor: CUSTOM_BLUE }}>
                  #{project.id}
                </span>
              </div>
              
              {/* Corregida sugerencia de 'flex-grow' a 'grow' */}
              <p className="mt-1 text-sm text-neutral-600 line-clamp-3 mb-6 leading-relaxed grow"> 
                {project.description}
              </p>
              
              <div className="mt-auto border-t border-neutral-200 pt-4">
                <div className="flex justify-between text-xs font-medium text-neutral-500">
                  <div className="flex flex-col">
                    <span className="uppercase tracking-wider text-[10px] mb-1">Inicio</span>
                    <span className="text-neutral-900 bg-neutral-100 px-2 py-1 rounded font-semibold">{formatDate(project.start)}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="uppercase tracking-wider text-[10px] mb-1">Fin</span>
                    <span className="text-neutral-900 bg-neutral-100 px-2 py-1 rounded font-semibold">{formatDate(project.end)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* --- MODALES --- */}

      {/* 1. MODAL CREAR PROYECTO */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity">
          <form onSubmit={handleCreateProject} className={MODAL_CONTAINER_CLASSES} style={{ borderColor: CUSTOM_BLUE }}>
            <h2 className={`mb-6 text-2xl font-bold border-b pb-2`} style={{ color: CUSTOM_BLUE, borderColor: CUSTOM_BLUE }}>
              Nuevo Proyecto
            </h2>
            
            <div className="mb-4">
              <label className="block font-semibold mb-1 text-sm text-neutral-700">Nombre del proyecto</label>
              <input className={INPUT_CLASSES} value={newProjectName} onChange={e => setNewProjectName(e.target.value)} required placeholder="Ej: Rediseño Web..." />
            </div>
            
            <div className="mb-4">
              <label className="block font-semibold mb-1 text-sm text-neutral-700">Descripción</label>
              <textarea className={INPUT_CLASSES} rows={3} value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)} required placeholder="Detalles del alcance..." />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block font-semibold mb-1 text-sm text-neutral-700">Fecha Inicio</label>
                <input type="date" className={INPUT_CLASSES} value={startDate} min={todayStr} onChange={e => setStartDate(e.target.value)} required />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-sm text-neutral-700">Fecha Fin</label>
                <input type="date" className={INPUT_CLASSES} value={endDate} min={startDate || todayStr} onChange={e => setEndDate(e.target.value)} required />
              </div>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => setShowProjectModal(false)} className={CANCEL_BUTTON_CLASSES}>CANCELAR</button>
              <button type="submit" 
                className={`flex-1 ${BORDER_CLASS} py-3 font-bold transition-colors`} 
                style={BLUE_BUTTON_STYLE} 
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, HOVER_BLUE_BUTTON_STYLE)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, BLUE_BUTTON_STYLE)}
              >
                GUARDAR PROYECTO
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. MODAL CREAR TAREA */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <form onSubmit={handleCreateTask} className={MODAL_CONTAINER_CLASSES} style={{ borderColor: CUSTOM_BLUE }}>
            <h2 className={`mb-6 text-2xl font-bold border-b pb-2`} style={{ color: CUSTOM_BLUE, borderColor: CUSTOM_BLUE }}>
              Nueva Tarea
            </h2>
            
            <div className="mb-4">
              <label className="block font-semibold mb-1 text-sm text-neutral-700">Proyecto</label>
              <select className={`${INPUT_CLASSES} bg-white`} value={selectedProjectId} onChange={(e) => handleProjectSelect(e.target.value)} required>
                <option value="">-- Selecciona un proyecto --</option>
                {projects.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block font-semibold mb-1 text-sm text-neutral-700">Módulo</label>
              <select className={`${INPUT_CLASSES} bg-white disabled:bg-neutral-100 disabled:text-neutral-400`} value={selectedModuleId || ""} onChange={(e) => setSelectedModuleId(Number(e.target.value))} required disabled={!selectedProjectId}>
                <option value="">-- Selecciona un módulo --</option>
                {availableModules.map(m => (<option key={m.id} value={m.id}>{m.title}</option>))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block font-semibold mb-1 text-sm text-neutral-700">Título de la tarea</label>
              <input className={INPUT_CLASSES} value={taskTitle} onChange={e => setTaskTitle(e.target.value)} required placeholder="Ej: Crear base de datos..." />
            </div>
            
            <div className="mb-8">
              <label className="block font-semibold mb-1 text-sm text-neutral-700">Descripción (Opcional)</label>
              <textarea className={INPUT_CLASSES} rows={2} value={taskDesc} onChange={e => setTaskDesc(e.target.value)} placeholder="Detalles técnicos..." />
            </div>
            
            <div className="flex gap-4">
              <button type="button" onClick={() => setShowTaskModal(false)} className={CANCEL_BUTTON_CLASSES}>CANCELAR</button>
              <button type="submit" 
                className={`flex-1 ${BORDER_CLASS} py-3 font-bold transition-colors`} 
                style={BLUE_BUTTON_STYLE} 
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, HOVER_BLUE_BUTTON_STYLE)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, BLUE_BUTTON_STYLE)}
              >
                CREAR TAREA
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. MODAL ELIMINAR PROYECTO */}
      {showDeleteProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <form onSubmit={handleDeleteProject} className={MODAL_CONTAINER_CLASSES} style={{ borderColor: RED_COLOR }}>
            <h2 className={`mb-2 text-2xl font-bold`} style={{ color: RED_COLOR }}>
              Eliminar Proyecto
            </h2>
            <p className="text-neutral-600 mb-6 text-sm border-b pb-4">
              Esta acción es <strong>irreversible</strong>. Se eliminará el proyecto y toda la información asociada (módulos, tareas, asignaciones).
            </p>
            
            <div className="mb-8">
              <label className="block font-semibold mb-1 text-sm text-neutral-700">Selecciona el proyecto a eliminar</label>
              <select className={`${INPUT_CLASSES} bg-white border-red-300 focus:border-red-500`} value={projectToDelete} onChange={(e) => setProjectToDelete(e.target.value)} required>
                <option value="">-- Selecciona --</option>
                {projects.map(p => (<option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>))}
              </select>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => setShowDeleteProjectModal(false)} className={CANCEL_BUTTON_CLASSES}>CANCELAR</button>
              <button type="submit" 
                className={`flex-1 ${BORDER_CLASS} py-3 font-bold transition-colors`} 
                style={RED_BUTTON_STYLE} 
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, HOVER_RED_BUTTON_STYLE)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, RED_BUTTON_STYLE)}
              >
                ELIMINAR DEFINITIVAMENTE
              </button>
            </div>
          </form>
        </div>
      )}
    </MainLayout>
  );
}