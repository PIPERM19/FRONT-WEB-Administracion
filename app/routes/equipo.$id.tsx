import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { MainLayout } from "../components/main-layout";

import { 
  getProjects, 
  getProjectTeams 
} from "../services/projectService";
import type { Team, Project } from "../types/projects";

// ESTILOS CONSTANTES
const CUSTOM_BLUE = "#0D3B66";
const BORDER_CLASS = "border rounded-lg shadow-sm";

export default function EquipoDetail() {
  const { id } = useParams(); 

  // ESTADOS
  const [team, setTeam] = useState<Team | null>(null);
  const [parentProject, setParentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // CARGA INICIAL
  useEffect(() => {
    if (id) findTeamData(id);
  }, [id]);

  const findTeamData = async (teamIdToFind: string) => {
    setLoading(true);
    try {
      const allProjects = await getProjects();
      
      let foundTeam: Team | undefined;
      let foundProject: Project | undefined;

      for (const proj of allProjects) {
        try {
          const teams = await getProjectTeams(proj.id);
          const match = teams.find(t => t.id.toString() === teamIdToFind);
          
          if (match) {
            foundTeam = match;
            foundProject = proj;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (foundTeam && foundProject) {
        setTeam(foundTeam);
        setParentProject(foundProject);
      } else {
        setError("No se encontró el equipo especificado.");
      }

    } catch (err) {
      console.error(err);
      setError("Error de conexión al buscar el equipo.");
    } finally {
      setLoading(false);
    }
  };

  // Funciones auxiliares
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  // RENDERIZADO
  if (loading) {
    return (
      <MainLayout contentClassName="flex items-center justify-center min-h-[50vh]">
        <div className="text-xl text-gray-500 font-medium animate-pulse">Buscando información del equipo...</div>
      </MainLayout>
    );
  }

  if (error || !team || !parentProject) {
    return (
      <MainLayout contentClassName="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error || "El equipo no existe o fue eliminado."}</p>
          <Link to="/equipos" className="mt-4 inline-block font-bold underline">Volver a la lista</Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout fullWidth contentClassName="flex flex-col gap-8 relative p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-2">
        <Link 
          to="/equipos" 
          className="text-sm font-semibold text-gray-500 hover:text-blue-900 transition-colors w-fit"
        >
          ← Volver a Equipos
        </Link>
        
        <div className="flex justify-between items-end border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">{team.name}</h1>
            <p className="text-gray-500 mt-2 text-lg">Detalles y asignación</p>
          </div>
          {/*ID oculto*/}
        </div>
      </div>

      {/* --- GRID DE INFORMACIÓN --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: DATOS DEL EQUIPO */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tarjeta Principal */}
          <div className={`bg-white p-8 ${BORDER_CLASS}`}>
            <h3 className="text-lg font-bold uppercase tracking-wide text-gray-400 mb-6">Información del Equipo</h3>
            
            <div className="grid gap-6">
              <div>
                <p className="text-sm font-bold text-gray-600 uppercase mb-1">Descripción</p>
                <p className="text-xl text-gray-900 leading-relaxed">
                  {team.description || "Sin descripción disponible."}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                   <p className="text-sm font-bold text-gray-600 uppercase mb-1">Departamento</p>
                   <p className="text-gray-900 font-medium">Ingeniería & Desarrollo</p>
                </div>
                <div>
                   <p className="text-sm font-bold text-gray-600 uppercase mb-1">Estado</p>
                   <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
                     Activo
                   </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: CONTEXTO DEL PROYECTO (SIDEBAR) */}
        <div className="lg:col-span-1">
          <div className={`bg-white p-6 ${BORDER_CLASS} border-t-4`} style={{ borderTopColor: CUSTOM_BLUE }}>
            <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-900"></span>
              Proyecto Asignado
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Nombre del Proyecto</p>
                <Link 
                  to={`/proyecto/${parentProject.id}`} 
                  className="text-lg font-bold text-blue-900 hover:underline break-words"
                >
                  {parentProject.name}
                </Link>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Descripción Global</p>
                <p className="text-sm text-gray-600 line-clamp-3">{parentProject.description}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded border border-gray-100 grid grid-cols-2 gap-2 text-center">
                 <div>
                    <span className="block text-[10px] uppercase text-gray-400 font-bold">Inicio</span>
                    <span className="text-xs font-bold text-gray-800">{formatDate(parentProject.start)}</span>
                 </div>
                 <div>
                    <span className="block text-[10px] uppercase text-gray-400 font-bold">Entrega</span>
                    <span className="text-xs font-bold text-gray-800">{formatDate(parentProject.end)}</span>
                 </div>
              </div>

              <Link 
                to={`/proyecto/${parentProject.id}`}
                className="block w-full text-center py-2 rounded text-sm font-bold text-white transition-opacity hover:opacity-90 mt-4"
                style={{ backgroundColor: CUSTOM_BLUE }}
              >
                Ver Proyecto Completo
              </Link>
            </div>
          </div>

          {/* Tarjeta Informativa */}
          <div className="mt-6 bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-2">Gestión de Miembros</h4>
            <p className="text-sm text-blue-800 mb-4">
              Para ver quiénes integran este equipo, consulta la sección de miembros dentro del Proyecto. O hasta que se implemente una gestión de equipos dedicada.
            </p>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}