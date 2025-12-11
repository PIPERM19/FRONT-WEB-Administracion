import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { MainLayout } from "../components/main-layout";
import { 
  getProjects, 
  createProject, 
  getProjectModules, 
  createTask 
} from "../services/projectService";
import type { Project, Module } from "../types/projects";

// Definición del color de borde y fondo usado en el DISEÑO original
const CUSTOM_BLUE = "#0D3B66";
const BORDER_CLASS = "border-2 rounded-lg"; // Clase para grosor y redondeo

export default function Dashboard() {
  const navigate = useNavigate();
  
  // ESTADOS DE DATOS
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // ESTADOS DE MODALES
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // ESTADOS FORMULARIO PROYECTO
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  // Fechas (Strings vacíos al inicio)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ESTADOS FORMULARIO TAREA
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [availableModules, setAvailableModules] = useState<Module[]>([]);

  // CARGAR DATOS INICIALES
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("userID");
    
    setRole(storedRole);
    if (storedUserId) setUserId(parseInt(storedUserId));

    loadProjects();
  }, []);

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

  // CREAR PROYECTO
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      await createProject({
        name: newProjectName,
        description: newProjectDesc,
        client_id: 2, 
        team_leader_id: userId,
        start: new Date(startDate).toISOString(),
        end: new Date(endDate).toISOString(), 
      });

      setShowProjectModal(false);
      loadProjects(); 
      alert("Proyecto creado con éxito");
      
      // Resetear formulario
      setNewProjectName("");
      setNewProjectDesc("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      alert("Error al crear proyecto (Verifica consola)");
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

  // RENDERIZADO
  const formatDate = (dateString: string) => {
    if(!dateString) return "";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  // Fecha mínima (Hoy)
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <MainLayout fullWidth contentClassName="flex flex-col gap-10 relative p-4 sm:p-6 lg:p-8">
      
      {/* ACCIONES DE ADMIN */}
      {(role === "0" || role === "1") && (
        <section className="grid gap-6 md:grid-cols-2">
          {/* Tarjeta de Nuevo Proyecto */}
          <div className={`flex items-center justify-between bg-neutral-100 p-6 ${BORDER_CLASS}`} style={{ borderColor: CUSTOM_BLUE }}>
            <div>
              <h3 className="text-lg font-bold">Nuevo Proyecto</h3>
              <p className="text-sm text-neutral-600">Inicia un nuevo espacio de trabajo</p>
            </div>
            <button onClick={() => setShowProjectModal(true)} 
                className={`px-6 py-2 text-white font-bold transition-colors ${BORDER_CLASS}`} 
                style={{ backgroundColor: CUSTOM_BLUE, borderColor: CUSTOM_BLUE }}
              >
              CREAR +
            </button>
          </div>
          
          {/* Tarjeta de Nueva Tarea */}
          <div className={`flex items-center justify-between bg-neutral-100 p-6 ${BORDER_CLASS}`} style={{ borderColor: CUSTOM_BLUE }}>
            <div>
              <h3 className="text-lg font-bold">Nueva Tarea</h3>
              <p className="text-sm text-neutral-600">Asigna trabajo a un módulo</p>
            </div>
            <button onClick={() => setShowTaskModal(true)} 
                className={`px-6 py-2 text-white font-bold transition-colors ${BORDER_CLASS}`} 
                style={{ backgroundColor: CUSTOM_BLUE, borderColor: CUSTOM_BLUE }}
              >
              CREAR +
            </button>
          </div>
        </section>
      )}

      {/* CONTENEDOR PRINCIPAL DE PROYECTOS */}
      <section className="grid gap-6 grid-cols-1">
        <div className={`bg-white p-8 ${BORDER_CLASS}`} style={{ borderColor: CUSTOM_BLUE }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">{(role === "0" || role === "1") ? "Todos los Proyectos" : "Mis Proyectos"}</h2>
            {/* Etiqueta de conteo con estilo en línea para el color de fondo */}
            <span className="text-sm font-bold text-white px-3 py-1 rounded-full" style={{ backgroundColor: CUSTOM_BLUE }}>{projects.length}</span>
          </div>
          {projects.length === 0 ? (
            <div className="text-center py-10 text-neutral-500 border-2 border-dashed border-gray-300 rounded-lg">
              <p>No hay proyectos disponibles.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((proj) => (
                <div key={proj.id} className={`flex flex-col gap-2 bg-white p-4 transition-colors hover:bg-neutral-50 ${BORDER_CLASS}`} style={{ borderColor: CUSTOM_BLUE }}>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold truncate">{proj.name}</h3>
                    <span className="text-xs font-mono bg-neutral-200 px-1 border rounded" style={{ borderColor: CUSTOM_BLUE }}>ID: {proj.id}</span>
                  </div>
                  <p className="text-sm text-neutral-600 line-clamp-2 min-h-[40px]">{proj.description}</p>
                  <div className="mt-auto pt-3 border-t border-gray-200 flex justify-between text-xs font-semibold text-neutral-500">
                    <span>Inicio: {formatDate(proj.start)}</span>
                    <span>Fin: {formatDate(proj.end)}</span>
                  </div>
                  <Link to={`/proyecto/${proj.id}`} 
                       className={`mt-2 text-center py-1 text-sm text-white rounded-lg border-2 font-bold`} 
                       style={{ backgroundColor: CUSTOM_BLUE, borderColor: CUSTOM_BLUE, color: 'white' }} 
                       onMouseEnter={(e) => {
                           // Manejo de hover: fondo blanco, texto azul
                           e.currentTarget.style.backgroundColor = 'white';
                           e.currentTarget.style.color = CUSTOM_BLUE;
                       }}
                       onMouseLeave={(e) => {
                           // Manejo de hover: fondo azul, texto blanco
                           e.currentTarget.style.backgroundColor = CUSTOM_BLUE;
                           e.currentTarget.style.color = 'white';
                       }}
                    >
                    VER DETALLES
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CREAR PROYECTO (Modal) */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <form onSubmit={handleCreateProject} 
                className={`w-full max-w-lg bg-white p-8 rounded-lg border-4`} 
                style={{ borderColor: CUSTOM_BLUE }}
            > 
            <h2 className="mb-6 text-2xl font-bold uppercase">Nuevo Proyecto</h2>
            
            <div className="mb-4">
              <label className="block font-bold mb-2">Nombre</label>
              <input 
                className="w-full border-2 border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-gray-500"
                value={newProjectName} 
                onChange={e => setNewProjectName(e.target.value)} 
                required 
              />
            </div>
            
            <div className="mb-4">
              <label className="block font-bold mb-2">Descripción</label>
              <textarea 
                className="w-full border-2 border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-gray-500"
                rows={3} 
                value={newProjectDesc} 
                onChange={e => setNewProjectDesc(e.target.value)} 
                required 
              />
            </div>

            {/* FECHAS */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block font-bold mb-2">Inicio</label>
                <input 
                  type="date" 
                  className="w-full border-2 border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-gray-500"
                  value={startDate}
                  min={todayStr}
                  onChange={e => setStartDate(e.target.value)}
                  required 
                />
              </div>
              <div>
                <label className="block font-bold mb-2">Fin</label>
                <input 
                  type="date" 
                  className="w-full border-2 border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-gray-500"
                  value={endDate}
                  min={startDate || todayStr}
                  onChange={e => setEndDate(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <button type="button" onClick={() => setShowProjectModal(false)} className="flex-1 border-2 border-gray-300 py-3 font-bold rounded-lg hover:bg-neutral-100">CANCELAR</button>
              <button type="submit" 
                className={`flex-1 text-white py-3 font-bold border-2 rounded-lg`} 
                style={{ backgroundColor: CUSTOM_BLUE, borderColor: CUSTOM_BLUE }}
              >GUARDAR</button>
            </div>
          </form>
        </div>
      )}

      {/* Crear Tarea (Modal) */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <form onSubmit={handleCreateTask} 
                className={`w-full max-w-lg bg-white p-8 rounded-lg border-4`}
                style={{ borderColor: CUSTOM_BLUE }}
            > 
            <h2 className="mb-6 text-2xl font-bold uppercase">Nueva Tarea</h2>
            
            <div className="mb-4">
              <label className="block font-bold mb-2">Proyecto</label>
              <select className="w-full border-2 border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-gray-500 bg-white" 
                  value={selectedProjectId} 
                  onChange={(e) => handleProjectSelect(e.target.value)} 
                  required
              >
                <option value="">-- Selecciona --</option>
                {projects.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block font-bold mb-2">Módulo</label>
              <select className="w-full border-2 border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-gray-500 bg-white disabled:bg-gray-100" 
                  value={selectedModuleId || ""} 
                  onChange={(e) => setSelectedModuleId(Number(e.target.value))} 
                  required 
                  disabled={!selectedProjectId}
              >
                <option value="">-- Selecciona --</option>
                {availableModules.map(m => (<option key={m.id} value={m.id}>{m.title}</option>))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block font-bold mb-2">Título</label>
              <input className="w-full border-2 border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-gray-500" 
                  value={taskTitle} 
                  onChange={e => setTaskTitle(e.target.value)} 
                  required 
              />
            </div>
            
            <div className="mb-6">
              <label className="block font-bold mb-2">Descripción</label>
              <textarea className="w-full border-2 border-gray-300 p-3 rounded-md focus:ring-1 focus:ring-gray-500" 
                  rows={2} 
                  value={taskDesc} 
                  onChange={e => setTaskDesc(e.target.value)} 
              />
            </div>
            
            <div className="flex gap-4">
              <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 border-2 border-gray-300 py-3 font-bold rounded-lg hover:bg-neutral-100">CANCELAR</button>
              <button type="submit" 
                className={`flex-1 text-white py-3 font-bold border-2 rounded-lg`}
                style={{ backgroundColor: CUSTOM_BLUE, borderColor: CUSTOM_BLUE }}
              >GUARDAR</button>
            </div>
          </form>
        </div>
      )}
    </MainLayout>
  );
}