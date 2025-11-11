import { useState } from "react";
import { MainLayout } from "../components/main-layout";

const conversations = [
  {
    id: "equipo-frontend",
    title: "Equipo Frontend",
    preview: "Juan: Vamos a revisar el diseño...",
    members: "6 miembros",
    active: true,
  },
  {
    id: "proyecto-alpha",
    title: "Proyecto Alpha",
    preview: "María: El API está listo",
    members: "8 miembros",
  },
  {
    id: "carlos",
    title: "Carlos López",
    preview: "Tú: Perfecto, gracias!",
    members: "Chat directo",
  },
  {
    id: "equipo-backend",
    title: "Equipo Backend",
    preview: "Ana: Necesitamos actualizar...",
    members: "5 miembros",
  },
];

const chatMessages = [
  {
    id: "1",
    initials: "JP",
    name: "Juan Pérez",
    time: "10:30 AM",
    message: "Buenos días equipo! ¿Podemos revisar el diseño de la nueva landing page?",
    variant: "otro",
  },
  {
    id: "2",
    initials: "MG",
    name: "María García",
    time: "10:32 AM",
    message: "Claro! Ya subí los mockups al proyecto. ¿Los han visto?",
    variant: "otro",
  },
  {
    id: "3",
    initials: "CL",
    name: "Carlos López",
    time: "10:35 AM",
    message: "Sí, se ven muy bien! Me gusta especialmente el uso del espacio en blanco.",
    variant: "otro",
  },
  {
    id: "4",
    initials: "AM",
    name: "Ana Martínez",
    time: "10:37 AM",
    message: "Estoy de acuerdo. ¿Cuándo empezamos con la implementación?",
    variant: "otro",
  },
  {
    id: "5",
    initials: "TU",
    name: "Tú",
    time: "10:40 AM",
    message: "Podríamos empezar mañana. Ya tengo la estructura base lista.",
    variant: "propio",
  },
];

export default function Chat() {
  const [message, setMessage] = useState("");

  return (
    <MainLayout
      fullWidth
      contentClassName="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]"
    >
      <aside className="border-2 border-black bg-white">
        <div className="border-b-2 border-black p-5">
          <h1 className="text-xl font-semibold">Conversaciones</h1>
        </div>
        <ul className="divide-y-2 divide-black">
          {conversations.map((conversation) => (
            <li
              key={conversation.id}
              className={`cursor-pointer border-black px-5 py-4 transition-colors ${
                conversation.active ? "bg-neutral-100" : "bg-white hover:bg-neutral-100"
              }`}
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold">{conversation.title}</span>
                <span className="text-xs text-neutral-600">{conversation.preview}</span>
                <span className="text-[11px] text-neutral-500">{conversation.members}</span>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <section className="flex h-full flex-col border-2 border-black bg-white">
        <header className="border-b-2 border-black p-6">
          <h2 className="text-xl font-semibold">Equipo Frontend</h2>
          <p className="mt-1 text-sm text-neutral-600">6 miembros activos</p>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-6">
            {chatMessages.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center border-2 border-black font-semibold ${
                    item.variant === "propio" ? "bg-black text-white" : "bg-white"
                  }`}
                >
                  {item.initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-sm font-semibold">{item.name}</span>
                    <span className="text-xs text-neutral-500">{item.time}</span>
                  </div>
                  <div
                    className={`mt-3 border-2 border-black p-4 text-sm leading-relaxed ${
                      item.variant === "propio" ? "bg-black text-white" : "bg-white"
                    }`}
                  >
                    {item.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <footer className="border-t-2 border-black p-6">
          <form
            className="flex gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              setMessage("");
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 border-2 border-black bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_#000]"
            />
            <button
              type="submit"
              className="border-2 border-black bg-black px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Enviar
            </button>
          </form>
        </footer>
      </section>
    </MainLayout>
  );
}
