import { useState } from "react";
import { Link } from "react-router";
import { MainLayout } from "../components/main-layout";

const teams = [
  {
    id: "1",
    name: "Desarrollo Frontend",
    summary: "Equipo encargado del desarrollo de interfaces de usuario",
    lead: "Juan Pérez",
    members: "6/10",
    projects: 3,
  },
  {
    id: "2",
    name: "Desarrollo Backend",
    summary: "Equipo encargado de la lógica del servidor y APIs",
    lead: "María García",
    members: "5/8",
    projects: 4,
  },
  {
    id: "3",
    name: "Diseño UI/UX",
    summary: "Equipo de diseño de experiencia e interfaz de usuario",
    lead: "Carlos López",
    members: "4/6",
    projects: 2,
  },
  {
    id: "4",
    name: "Control de Calidad",
    summary: "Equipo encargado de pruebas y aseguramiento de calidad",
    lead: "Ana Martínez",
    members: "3/5",
    projects: 5,
  },
];

export default function Equipos() {
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  return (
    <MainLayout contentClassName="flex flex-col gap-10">
      <header className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold">Equipos</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Gestiona la composición de cada equipo y su carga de trabajo.
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
                Crear nuevo equipo
              </button>
              <button
                type="button"
                onClick={() => setShowActionsMenu(false)}
                className="w-full px-4 py-3 text-left text-sm font-medium hover:bg-neutral-100"
              >
                Añadir miembro a equipo
              </button>
            </div>
          )}
        </div>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        {teams.map((team) => (
          <Link
            key={team.id}
            to={`/equipo/${team.id}`}
            className="border-2 border-black bg-white p-6 transition-transform hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold">{team.name}</h2>
            <p className="mt-2 text-sm text-neutral-600">{team.summary}</p>
            <dl className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <dt className="font-semibold">Líder</dt>
                <dd>{team.lead}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="font-semibold">Miembros</dt>
                <dd>{team.members}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="font-semibold">Proyectos activos</dt>
                <dd>{team.projects}</dd>
              </div>
            </dl>
          </Link>
        ))}
      </section>
    </MainLayout>
  );
}
