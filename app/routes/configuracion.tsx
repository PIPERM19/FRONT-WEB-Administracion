// routes/configuracion.tsx (Código final con la integración de la API)

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { MainLayout } from "../components/main-layout";
// IMPORTACIÓN ACTUALIZADA: Usar authService.ts
import { getProfile } from "../services/authService"; 
import type { UserProfileResponse } from "../types/user"; 

// Datos de configuración estáticos
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

// Función para mapear el rol numérico a un departamento o puesto
const getDepartmentByRole = (role: number) => {
    switch (role) {
        case 0: // Admin
        case 1: // Team Leader
            return { puesto: "Líder de Proyecto", departamento: departamentos[0] };
        case 2: // Miembro
        default:
            return { puesto: "Miembro de Equipo", departamento: departamentos[1] };
    }
}

export default function Configuracion() {
  const navigate = useNavigate();

  // ESTADOS PARA DATOS DEL USUARIO
  const [name, setName] = useState("Cargando...");
  const [email, setEmail] = useState("Cargando...");
  const [puesto, setPuesto] = useState("Cargando...");
  const [departamento, setDepartamento] = useState(departamentos[0]);
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // LÓGICA DE CARGA DE PERFIL (USANDO LA API REAL)
  useEffect(() => {
    const loadProfile = async () => {
        try {
            const profileData: UserProfileResponse = await getProfile();
            
            // Mapear el rol a valores de Puesto/Departamento
            const { puesto: mappedPuesto, departamento: mappedDepartamento } = getDepartmentByRole(profileData.role);

            // Setear los estados con datos reales de la API
            setName(profileData.name);
            setEmail(profileData.email);
            setPhone(profileData.phone || ""); // Usar teléfono si existe, o string vacío
            setPuesto(mappedPuesto);
            
            // Asegurarse de que el departamento cargado esté en la lista de opciones
            if (departamentos.includes(mappedDepartamento)) {
                setDepartamento(mappedDepartamento);
            } else {
                setDepartamento(departamentos[0]); // Default si no se encuentra
            }

        } catch (error) {
            console.error("Error al cargar el perfil del usuario:", error);
            // Mostrar un estado de error
            setName("Error al cargar");
            setEmail("Error al cargar");
            setPuesto("Error al cargar");
            setPhone("");
        } finally {
            setIsLoading(false);
        }
    };

    loadProfile();
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("userID");
    localStorage.removeItem("userKey");
    navigate("/");
  };
  
  // Función para manejar la actualización del perfil (Lógica pendiente)
  const handleProfileUpdate = (e: React.FormEvent) => {
      e.preventDefault();
      // TODO: Implementar la llamada a la API PUT /user/profile con los nuevos datos
      alert("Guardar perfil (Lógica de API PUT pendiente)");
  }

  return (
    <MainLayout contentClassName="flex flex-col gap-10">
      <header>
        <h1 className="text-3xl font-semibold">Configuración</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Personaliza tu experiencia de trabajo diario en PMaster.
        </p>
      </header>

      {/* SECCIÓN PERFIL DE USUARIO */}
      <section className="border-2 border-black bg-white p-8">
        <h2 className="text-2xl font-semibold">Perfil de usuario</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Actualiza tu información personal y mantén tus datos al día.
        </p>
        <form onSubmit={handleProfileUpdate} className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium">
              Nombre completo
              <input
                type="text"
                value={name} 
                onChange={e => setName(e.target.value)} 
                disabled={isLoading}
                placeholder="Nombre completo"
                className="border-2 border-black bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_#000] disabled:bg-gray-100"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Correo electrónico
              <input
                type="email"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                disabled={isLoading}
                placeholder="usuario@ejemplo.com"
                className="border-2 border-black bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_#000] disabled:bg-gray-100"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Puesto
              <input
                type="text"
                value={puesto} 
                onChange={e => setPuesto(e.target.value)} 
                disabled={isLoading}
                placeholder="Puesto actual"
                className="border-2 border-black bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_#000] disabled:bg-gray-100"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Departamento
              <select 
                value={departamento} 
                onChange={e => setDepartamento(e.target.value)} 
                disabled={isLoading}
                className="border-2 border-black bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_#000] disabled:bg-gray-100"
              >
                {departamentos.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Teléfono
              <input
                type="tel"
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                disabled={isLoading}
                placeholder="Número de teléfono (opcional)"
                className="border-2 border-black bg-white px-4 py-3 text-sm outline-none transition-shadow focus:shadow-[4px_4px_0_0_#000] disabled:bg-gray-100"
              />
            </label>
          </div>
          <button
            type="submit" 
            disabled={isLoading}
            className="border-2 border-black bg-white px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            Guardar cambios
          </button>
        </form>
      </section>

      {/* BOTÓN DE CERRAR SESIÓN */}
        <div className="mt-8 border-t-2 border-black pt-6 flex justify-end">
          <button
            type="button"
            onClick={handleLogout}
            className="border-2 border-red-600 bg-red-500 text-white px-6 py-3 text-sm font-semibold transition-colors hover:bg-red-700 hover:border-red-700"
          >
            CERRAR SESIÓN
          </button>
        </div>

      {/* SECCIÓN SEGURIDAD 
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
        
      </section>*/}

      {/* Otras secciones... 
      <section className="border-2 border-black bg-white p-8">
        <h2 className="text-2xl font-semibold">Notificaciones</h2>
      </section>

      <section className="border-2 border-black bg-white p-8">
        <h2 className="text-2xl font-semibold">Preferencias de la aplicación</h2>
      
      </section> */}
    </MainLayout>
  );
}