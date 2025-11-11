import { MainLayout } from "../components/main-layout";

const departamentos = ["Desarrollo", "Diseño", "Marketing", "Producto", "Operaciones"];
const idiomas = ["Español", "English", "Français", "Deutsch"];
const zonasHorarias = [
  "GMT-5 (Ciudad de México)",
  "GMT-3 (Buenos Aires)",
  "GMT+0 (Madrid)",
  "GMT+1 (París)",
];
const formatosFecha = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];
const temas = ["Oscuro", "Claro", "Automático"];

export default function Configuracion() {
  return (
    <MainLayout contentClassName="flex flex-col gap-10">
      <header>
        <h1 className="text-3xl font-semibold">Configuración</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Personaliza tu experiencia de trabajo diario en PMaster.
        </p>
      </header>

      <section className="border-2 border-black bg-white p-8">
        <h2 className="text-2xl font-semibold">Perfil de usuario</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Actualiza tu información personal y mantén tus datos al día.
        </p>
        <form className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium">
              Nombre completo
              <input
                type="text"
                placeholder="Juan Pérez"
                className="border-2 border-black bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_#000]"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Correo electrónico
              <input
                type="email"
                placeholder="usuario@ejemplo.com"
                className="border-2 border-black bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_#000]"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Puesto
              <input
                type="text"
                placeholder="Desarrollador Senior"
                className="border-2 border-black bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_#000]"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Departamento
              <select className="border-2 border-black bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_#000]">
                {departamentos.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="button"
            className="border-2 border-black bg-white px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
          >
            Guardar cambios
          </button>
        </form>
      </section>

      <section className="border-2 border-black bg-white p-8">
        <h2 className="text-2xl font-semibold">Seguridad</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Protege tu cuenta con una contraseña segura y verificación adicional.
        </p>
        <form className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium">
              Contraseña actual
              <input
                type="password"
                placeholder="••••••••"
                className="border-2 border-black bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_#000]"
              />
            </label>
            <div />
            <label className="flex flex-col gap-2 text-sm font-medium">
              Nueva contraseña
              <input
                type="password"
                placeholder="••••••••"
                className="border-2 border-black bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_#000]"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Confirmar nueva contraseña
              <input
                type="password"
                placeholder="••••••••"
                className="border-2 border-black bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_#000]"
              />
            </label>
          </div>
          <button
            type="button"
            className="border-2 border-black bg-white px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
          >
            Cambiar contraseña
          </button>
        </form>
        <div className="mt-8 border-t-2 border-black pt-6">
          <h3 className="text-lg font-semibold">Autenticación de dos factores</h3>
          <label className="mt-4 flex items-center gap-3 text-sm">
            <input type="checkbox" className="h-5 w-5 cursor-pointer border-2 border-black" />
            Habilitar autenticación de dos factores
          </label>
        </div>
      </section>

      <section className="border-2 border-black bg-white p-8">
        <h2 className="text-2xl font-semibold">Notificaciones</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Elige cómo quieres mantenerte al tanto de los avances del equipo.
        </p>
        <form className="mt-6 space-y-4 text-sm">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="h-5 w-5 cursor-pointer border-2 border-black" />
            Notificaciones por correo electrónico
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="h-5 w-5 cursor-pointer border-2 border-black" />
            Notificaciones de nuevas tareas asignadas
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="h-5 w-5 cursor-pointer border-2 border-black" />
            Notificaciones de comentarios en proyectos
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="h-5 w-5 cursor-pointer border-2 border-black" />
            Notificaciones de cambios en el equipo
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="h-5 w-5 cursor-pointer border-2 border-black" />
            Recordatorios de fechas límite
          </label>
          <button
            type="button"
            className="mt-4 border-2 border-black bg-white px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
          >
            Guardar preferencias
          </button>
        </form>
      </section>

      <section className="border-2 border-black bg-white p-8">
        <h2 className="text-2xl font-semibold">Preferencias de la aplicación</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Ajusta el idioma, la zona horaria y cómo se muestra la información.
        </p>
        <form className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium">
              Idioma
              <select className="border-2 border-black bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_#000]">
                {idiomas.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Zona horaria
              <select className="border-2 border-black bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_#000]">
                {zonasHorarias.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Formato de fecha
              <select className="border-2 border-black bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_#000]">
                {formatosFecha.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Tema
              <select className="border-2 border-black bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_#000]">
                {temas.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="button"
            className="border-2 border-black bg-white px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
          >
            Guardar configuración
          </button>
        </form>
      </section>
    </MainLayout>
  );
}
