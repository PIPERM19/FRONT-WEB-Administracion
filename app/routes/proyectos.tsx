import { useState } from "react";
import { Link } from "react-router";
import { MainLayout } from "../components/main-layout";

const projects = [
  {
    id: "1",
    name: "Proyecto Alpha",
    description: "Desarrollo de nueva plataforma web",
    team: "Frontend",
    tasks: "12/25",
    due: "15/12/2025",
  },
  {
    id: "2",
    name: "Proyecto Beta",
    description: "Rediseño de API RESTful",
    team: "Backend",
    tasks: "8/15",
    due: "20/12/2025",
  },
  {
    id: "3",
    name: "Proyecto Gamma",
    description: "Implementación de sistema de notificaciones",
    team: "Diseño UI/UX",
    tasks: "5/10",
    due: "30/12/2025",
  },
];

export default function Proyectos() {
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  return (
    <MainLayout contentClassName="flex flex-col gap-10">
      <header className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold">Proyectos</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Visualiza y gestiona los proyectos activos de PMaster.
          </p>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowActionsMenu((state) => !state)}
            className="border-2 border-black bg-white px-6 py-3 text-sm font-semibold transition-colors hover:bg-black hover:text-white"
          >
            Acciones
          </button>
          {showActionsMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 border-2 border-black bg-white shadow-lg">
              <button
                type="button"
                onClick={() => setShowActionsMenu(false)}
                className="flex w-full items-center justify-between border-b-2 border-black px-4 py-3 text-left text-sm font-medium hover:bg-neutral-100"
              >
                Crear nuevo proyecto
              </button>
              <button
                type="button"
                onClick={() => setShowActionsMenu(false)}
                className="w-full px-4 py-3 text-left text-sm font-medium hover:bg-neutral-100"
              >
                Añadir tarea a proyecto
              </button>
            </div>
          )}
        </div>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/proyecto/${project.id}`}
            className="border-2 border-black bg-white p-6 transition-transform hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <p className="mt-2 text-sm text-neutral-600">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium">
              <span>Equipo: {project.team}</span>
              <span>Tareas: {project.tasks}</span>
            </div>
            <div className="mt-4 text-xs text-neutral-600">Vence: {project.due}</div>
          </Link>
        ))}
      </section>
    </MainLayout>
  );
}
