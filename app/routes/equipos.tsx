import { useState, useEffect } from "react";
import { Link } from "react-router";
import { MainLayout } from "../components/main-layout";
// Importamos servicios y tipos
import { 
  getProjects, 
  getProjectTeams, 
  createProjectTeam 
} from "../services/projectService";
import type { Team, Project } from "../types/projects";

// Extendemos el tipo Team para incluir contexto del proyecto
interface TeamWithContext extends Team {
  projectName: string;
  projectId: string;
}

export default function Equipos() {
  //  ESTADOS
  const [role, setRole] = useState<string | null>(null);
  const [teams, setTeams] = useState<TeamWithContext[]>([]);
  const [projects, setProjects] = useState<Project[]>([]); // Necesario para el select del modal
  const [loading, setLoading] = useState(true);

  // ESTADOS VISUALES
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // ESTADOS FORMULARIO CREAR EQUIPO
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // CARGA INICIAL DE DATOS
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Traer todos los proyectos
      const allProjects = await getProjects();
      setProjects(allProjects);

      // Traer los equipos de CADA proyecto (en paralelo)
      const teamsPromises = allProjects.map(async (proj) => {
        try {
          const projTeams = await getProjectTeams(proj.id);
          // Agregamos el nombre del proyecto a cada equipo para mostrarlo en la tarjeta
          return projTeams.map(t => ({
            ...t,
            projectName: proj.name,
            projectId: proj.id
          }));
        } catch (e) {
          return []; // Si falla un proyecto, retornamos array vacío para no romper todo
        }
      });

      const results = await Promise.all(teamsPromises);
      // Aplanamos el array de arrays
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
      loadData(); // Recargar la lista

      // Resetear form
      setNewTeamName("");
      setNewTeamDesc("");
      setSelectedProjectId("");
    } catch (error) {
      alert("Error al crear equipo");
      console.error(error);
    }
  };

  // Permisos: Solo Admin (0) y Manager (1) pueden editar
  const canEdit = role === "0" || role === "1";

  return (
    <MainLayout contentClassName="flex flex-col gap-10 relative">
      <header className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold">Equipos</h1>
          <p className="mt-1 text-sm text-neutral-600">
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
              className="border-2 border-black bg-white px-6 py-3 text-sm font-semibold transition-colors hover:bg-black hover:text-white"
            >
              Acciones ▼
            </button>
            {showActionsMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 border-2 border-black bg-white shadow-lg z-10">
                <button
                  type="button"
                  onClick={() => {
                    setShowActionsMenu(false);
                    setShowCreateModal(true);
                  }}
                  className="flex w-full items-center justify-between border-b-2 border-black px-4 py-3 text-left text-sm font-medium hover:bg-neutral-100"
                >
                  Crear nuevo equipo
                </button>
                {/* Nota: La API actual no tiene endpoint directo para añadir miembros a un EQUIPO, 
                    solo a un PROYECTO. Es necesario que backend implemente esta funcionalidad */}
              </div>
            )}
          </div>
        )}
      </header>

      {/* LISTA DE EQUIPOS */}
      {loading ? (
        <div className="text-center py-10">Cargando equipos...</div>
      ) : teams.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-gray-300 text-neutral-500">
          No se encontraron equipos registrados.
        </div>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link
              key={`${team.projectId}-${team.id}`} // Key compuesta única
              to={`/equipo/${team.id}`}
              className="flex flex-col border-2 border-black bg-white p-6 transition-transform hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold">{team.name}</h2>
              <p className="mt-2 text-sm text-neutral-600 flex-grow">{team.description}</p>
              
              <dl className="mt-4 space-y-2 text-xs border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between">
                  <dt className="font-semibold uppercase text-neutral-500">Proyecto</dt>
                  <dd className="font-bold text-black truncate max-w-[150px]">{team.projectName}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="font-semibold uppercase text-neutral-500">ID Equipo</dt>
                  <dd className="font-mono bg-gray-100 px-1">{team.id}</dd>
                </div>
              </dl>
            </Link>
          ))}
        </section>
      )}

      {/* MODAL CREAR EQUIPO */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <form onSubmit={handleCreateTeam} className="w-full max-w-lg border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="mb-6 text-2xl font-bold uppercase">Nuevo Equipo</h2>
            
            <div className="mb-4">
              <label className="block font-bold mb-2">Asignar a Proyecto</label>
              <p className="text-xs text-gray-500 mb-2">Un equipo debe pertenecer a un proyecto.</p>
              <select 
                className="w-full border-2 border-black p-3 bg-white"
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

            <div className="mb-4">
              <label className="block font-bold mb-2">Nombre del Equipo</label>
              <input 
                className="w-full border-2 border-black p-3" 
                value={newTeamName} 
                onChange={e => setNewTeamName(e.target.value)} 
                required 
                placeholder="Ej. Desarrollo Backend"
              />
            </div>
            
            <div className="mb-6">
              <label className="block font-bold mb-2">Descripción</label>
              <textarea 
                className="w-full border-2 border-black p-3" 
                rows={3} 
                value={newTeamDesc} 
                onChange={e => setNewTeamDesc(e.target.value)} 
                required 
                placeholder="Funciones principales del equipo..."
              />
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 border-2 border-black py-3 font-bold hover:bg-neutral-200">CANCELAR</button>
              <button type="submit" className="flex-1 border-2 border-black bg-black py-3 text-white font-bold hover:bg-white hover:text-black">GUARDAR</button>
            </div>
          </form>
        </div>
      )}
    </MainLayout>
  );
}