import { Link } from "react-router";
import { MainLayout } from "../components/main-layout";

const quickLinks = [
  { to: "/proyectos", label: "Proyectos" },
  { to: "/equipos", label: "Equipos" },
  { to: "/chat", label: "Chat" },
  { to: "/configuracion", label: "Configuración" },
];

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const highlightedDays: Record<number, string> = {
  15: "Proyecto A",
  20: "Tarea X",
  25: "Reunión",
};

const upcomingEvents = [
  { date: "15/12/2025", description: "Entrega Proyecto Alpha" },
  { date: "20/12/2025", description: "Revisión de diseño" },
  { date: "25/12/2025", description: "Reunión con cliente" },
];

const recentMessages = [
  { name: "Juan Pérez", preview: "¿Podemos revisar el diseño mañana?", time: "Hace 10 min" },
  { name: "María García", preview: "El API está listo para pruebas", time: "Hace 1 hora" },
  { name: "Carlos López", preview: "Nuevas mockups disponibles", time: "Hace 3 horas" },
];

const tasks = [
  {
    title: "Revisar documentación del proyecto",
    subtitle: "Proyecto Alpha • Vence hoy",
    completed: false,
  },
  {
    title: "Actualizar base de datos",
    subtitle: "Proyecto Beta • Completada",
    completed: true,
  },
  {
    title: "Preparar presentación para cliente",
    subtitle: "Proyecto Gamma • Vence en 2 días",
    completed: false,
  },
  {
    title: "Revisar código del frontend",
    subtitle: "Proyecto Alpha • Vence en 5 días",
    completed: false,
  },
  {
    title: "Realizar pruebas de integración",
    subtitle: "Proyecto Beta • Vence en 1 semana",
    completed: false,
  },
];

export default function Dashboard() {
  const daysInMonth = 31;
  const today = 15;

  return (
    <MainLayout fullWidth contentClassName="flex flex-col gap-10">
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex min-h-[160px] items-center justify-center rounded-none border-2 border-black bg-white text-center text-xl font-semibold transition-transform hover:-translate-y-1"
          >
            {item.label}
          </Link>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="border-2 border-black bg-white p-8">
          <h2 className="mb-6 text-2xl font-semibold">Calendario de Proyectos y Tareas</h2>
          <div className="grid gap-4">
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide">
              {weekDays.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2 text-sm">
              {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1;
                const isToday = day === today;
                const note = highlightedDays[day];
                return (
                  <div
                    key={day}
                    className={`flex min-h-[72px] flex-col items-center justify-start gap-2 border-2 border-black p-3 text-center ${
                      isToday ? "bg-black text-white" : "bg-white"
                    }`}
                  >
                    <span className="text-base font-semibold">{day}</span>
                    {note && <span className="text-[10px] uppercase tracking-wide">{note}</span>}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-6 border-t-2 border-black pt-6">
            <h3 className="mb-4 text-lg font-semibold">Eventos Próximos</h3>
            <ul className="space-y-3 text-sm">
              {upcomingEvents.map((event) => (
                <li key={event.date} className="flex items-start gap-3">
                  <span className="font-semibold">{event.date}</span>
                  <span>{event.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-2 border-black bg-white p-8">
          <h2 className="mb-6 text-2xl font-semibold">Mensajes Recientes</h2>
          <div className="flex flex-col gap-4">
            {recentMessages.map((message) => (
              <div key={message.name} className="border-2 border-black bg-white p-4">
                <div className="mb-2 text-sm font-semibold">{message.name}</div>
                <p className="mb-2 text-sm text-neutral-700">{message.preview}</p>
                <span className="text-xs text-neutral-500">{message.time}</span>
              </div>
            ))}
            <Link
              to="/chat"
              className="w-full border-2 border-black bg-white py-3 text-center text-sm font-semibold transition-colors hover:bg-black hover:text-white"
            >
              Ver todos los mensajes
            </Link>
          </div>
        </div>
      </section>

      <section className="border-2 border-black bg-white p-8">
        <h2 className="mb-6 text-2xl font-semibold">Mis Tareas</h2>
        <div className="flex flex-col gap-4">
          {tasks.map((task) => (
            <label key={task.title} className="flex items-start gap-4 border-2 border-black bg-white p-4">
              <input
                type="checkbox"
                defaultChecked={task.completed}
                className="mt-1 h-5 w-5 cursor-pointer border-2 border-black bg-white"
              />
              <div className="flex-1">
                <div className={`text-sm font-semibold ${task.completed ? "line-through text-neutral-500" : ""}`}>
                  {task.title}
                </div>
                <div className="text-xs text-neutral-600">{task.subtitle}</div>
              </div>
            </label>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}

