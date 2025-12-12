import { useState, useEffect } from "react";
import { Link } from "react-router";
import { MainLayout } from "../components/main-layout";

import { 
  getProjects, 
  getProjectTeams, 
  createProjectTeam 
} from "../services/projectService";
import type { Team, Project } from "../types/projects";

// ESTILOS CONSTANTES
const CUSTOM_BLUE = "#0D3B66";
const BORDER_CLASS = "border rounded-lg shadow-sm";

// Extendemos el tipo Team para incluir contexto del proyecto
interface TeamWithContext extends Team {
  projectName: string;
  projectId: string;
}

export default function Equipos() {
  // ESTADOS
  const [role, setRole] = useState<string | null>(null);
  const [teams, setTeams] = useState<TeamWithContext[]>([]);
  const [projects, setProjects] = useState<Project[]>([]); 
  const [loading, setLoading] = useState(true);

  // ESTADOS VISUALES
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // ESTADOS FORMULARIO CREAR EQUIPO
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // CARGA INICIAL
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const allProjects = await getProjects();
      setProjects(allProjects);

      const teamsPromises = allProjects.map(async (proj) => {
        try {
          const projTeams = await getProjectTeams(proj.id);
          return projTeams.map(t => ({
            ...t,
            projectName: proj.name,
            projectId: proj.id 
          }));
        } catch (e) {
          return [];
        }
      });

      const results = await Promise.all(teamsPromises);
      setTeams(results.flat());

    } catch (error) {
      console.error("Error cargando equipos", error);
    } finally {
      setLoading(false);
    }
  };

  // MANEJO DE CREACIÓN DE EQUIPO
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      alert("Debes seleccionar un proyecto asociado");
      return;
    }

    try {
      await createProjectTeam(selectedProjectId, newTeamName, newTeamDesc);
      
      setShowCreateModal(false);
      alert("Equipo creado correctamente");
      loadData(); 

      setNewTeamName("");
      setNewTeamDesc("");
      setSelectedProjectId("");
    } catch (error) {
      alert("Error al crear equipo");
      console.error(error);
    }
  };

  const canEdit = role === "0" || role === "1";

  return (
    <MainLayout fullWidth contentClassName="flex flex-col gap-10 relative p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Equipos</h1>
          <p className="mt-1 text-sm text-gray-500">
            {canEdit 
              ? "Gestiona los equipos asignados a cada proyecto." 
              : "Visualiza los equipos de trabajo activos."}
          </p>
        </div>
        
        {/* BOTÓN DE ACCIONES (Solo Roles 0 y 1) */}
        {canEdit && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowActionsMenu((state) => !state)}
              className="px-6 py-3 text-sm font-bold text-white transition-all shadow-md rounded-lg hover:shadow-lg hover:-translate-y-0.5"
              style={{ backgroundColor: CUSTOM_BLUE }}
            >
              Acciones ▼
            </button>
            {showActionsMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-xl z-10 rounded-lg border border-gray-100 overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setShowActionsMenu(false);
                    setShowCreateModal(true);
                  }}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Crear nuevo equipo
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* LISTA DE EQUIPOS */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
            <div className="text-gray-400 font-medium animate-pulse">Cargando equipos...</div>
        </div>
      ) : teams.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400 bg-white">
          <p>No se encontraron equipos registrados.</p>
        </div>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link
              key={`${team.projectId}-${team.id}`} 
              to={`/equipo/${team.id}`}
              className={`group flex flex-col bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${BORDER_CLASS} border-gray-200 hover:border-blue-200`}
            >
              {/* HEADER DE LA TARJETA */}
              <div className="mb-3">
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-900 transition-colors">{team.name}</h2>
                {/* ID ELIMINADO AQUÍ */}
              </div>
              
              <p className="text-sm text-gray-600 flex-grow line-clamp-3 mb-4 leading-relaxed">
                  {team.description}
              </p>
              
              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-400 uppercase tracking-wider">Proyecto</span>
                  <span className="font-semibold text-blue-900 truncate max-w-[150px] bg-blue-50 px-2 py-1 rounded">
                    {team.projectName}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* MODAL CREAR EQUIPO */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <form onSubmit={handleCreateTeam} 
            className={`w-full max-w-lg bg-white p-8 shadow-2xl rounded-xl border border-gray-200`}
          >
            <h2 className="mb-6 text-2xl font-bold text-gray-800 border-b pb-4">Nuevo Equipo</h2>
            
            <div className="mb-5">
              <label className="block text-sm font-bold text-gray-700 mb-2">Asignar a Proyecto</label>
              <p className="text-xs text-gray-500 mb-2">Selecciona el proyecto al que pertenecerá este equipo.</p>
              <select 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none bg-white transition-shadow"
                value={selectedProjectId}
                onChange={e => setSelectedProjectId(e.target.value)}
                required
              >
                <option value="">-- Selecciona Proyecto --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Equipo</label>
              <input 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition-shadow" 
                value={newTeamName} 
                onChange={e => setNewTeamName(e.target.value)} 
                required 
                placeholder="Ej. Desarrollo Backend"
              />
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
              <textarea 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition-shadow" 
                rows={3} 
                value={newTeamDesc} 
                onChange={e => setNewTeamDesc(e.target.value)} 
                required 
                placeholder="Describe las responsabilidades principales..."
              />
            </div>

            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => setShowCreateModal(false)} 
                className="flex-1 py-3 font-bold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                CANCELAR
              </button>
              <button 
                type="submit" 
                className="flex-1 py-3 font-bold text-white rounded-lg hover:opacity-90 transition-opacity shadow-md"
                style={{ backgroundColor: CUSTOM_BLUE }}
              >
                GUARDAR
              </button>
            </div>
          </form>
        </div>
      )}
    </MainLayout>
  );
}