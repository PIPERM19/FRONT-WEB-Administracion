import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

// Definición del color de borde y título (Estilo Fácil)
const CUSTOM_BLUE = "#061B2E";

const navLinks = [
  { to: "/proyectos", label: "Proyectos" },
  { to: "/equipos", label: "Equipos" },
  //chat eliminado
];

type MainLayoutProps = {
  children: ReactNode;
  fullWidth?: boolean;
  contentClassName?: string;
};

function getLinkClasses(isActive: boolean) {
  const base = "transition-colors";
  // Mantengo los colores de texto y hover del layout original para los enlaces
  return isActive ? `${base} font-semibold` : `${base} text-neutral-600 hover:text-black`;
}

function normalizeRole(role: string | null) {
  if (!role) return "bronze";
  const r = role.toLowerCase();
  if (["platinum", "gold", "silver", "bronze"].includes(r)) return r;
  if (r === "3") return "platinum";
  if (r === "2") return "silver";  
  if (r === "1") return "gold";
  if (r === "0") return "bronze";
  return "bronze";
}

const tierStyles: Record<string, { ring: string; badgeBg: string; label: string }> = {
  platinum: { ring: "ring-2 ring-slate-400", badgeBg: "bg-slate-300", label: "Platinum" },
  gold:    { ring: "ring-2 ring-yellow-400", badgeBg: "bg-yellow-400", label: "Gold" },
  silver:  { ring: "ring-2 ring-gray-400", badgeBg: "bg-gray-400", label: "Silver" },
  bronze: { ring: "ring-2 ring-amber-700", badgeBg: "bg-amber-700", label: "Bronze" },
};

export function MainLayout({
  children,
  fullWidth = false,
  contentClassName = "",
}: MainLayoutProps) {
  const location = useLocation();
  const widthClass = fullWidth ? "max-w-6xl" : "max-w-4xl";

  //Esta por defecto "usuario"
  const [displayName, setDisplayName] = useState<string>("Usuario");
  const [avatarUrl, setAvatarUrl] = useState("/UAQ_info.png");
  const [tier, setTier] = useState<string>("bronze");

  useEffect(() => {
    const storedName = localStorage.getItem("username") || localStorage.getItem("name");
    const storedAvatar = localStorage.getItem("avatarUrl") || localStorage.getItem("logoUrl");
    const storedRole = localStorage.getItem("role");

    if (storedName) setDisplayName(storedName);
    if (storedAvatar) setAvatarUrl(storedAvatar);
    setTier(normalizeRole(storedRole));
  }, []);

  const initials = (displayName || "Usuario")
    .split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const style = tierStyles[tier] ?? tierStyles["bronze"];

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      {/* HEADER MODIFICADO: Borde azul (#061B2E), redondeado en la base y sombra */}
      <header 
          className="border-b-2 bg-white rounded-b-xl shadow-lg" 
          style={{ borderColor: CUSTOM_BLUE }} // Aplica el color del borde azul
      >
        <nav className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6">
          {/* Logo/Título con color azul */}
          <Link 
            to="/dashboard" 
            className="text-2xl font-bold tracking-tight"
            style={{ color: CUSTOM_BLUE }} // Color del texto del título
          >
            PMaster
          </Link>
          <div className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.to ||
                location.pathname.startsWith(`${link.to}/`);
              return (
                <Link key={link.to} to={link.to} className={getLinkClasses(isActive)}>
                  {link.label}
                </Link>
              );
            })}
          </div>
          {/* avatar y nombre con material segun su tier */}
          <Link to="/perfil" className="relative flex items-center gap-3" title={`${style.label} · ${displayName}`}>
            <div className={`relative ${style.ring} rounded-full w-10 h-10 flex items-center justify-center overflow-hidden`}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={String(displayName)} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-black text-white flex items-center justify-center font-bold">
                  {initials}
                </div>
              )}

              {/* insignia pequeña abajo a la derecha con su respectivo color de tier */}
              <span
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${style.badgeBg} flex items-center justify-center text-[10px] font-bold text-white`}
                aria-hidden
              >
                {tier === "platinum" ? "P" : tier === "gold" ? "G" : tier === "silver" ? "S" : "B"}
              </span>
            </div>

            <span className={getLinkClasses(location.pathname === "/perfil")}>{displayName}</span>
          </Link>
        </nav>
      </header> 
      <main className="flex flex-1 justify-center px-6 py-10">
        <div className={`w-full ${widthClass} ${contentClassName}`.trim()}>{children}</div>
      </main>
    </div>
  );
}