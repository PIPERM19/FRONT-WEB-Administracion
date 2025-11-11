import { Link, useLocation } from "react-router";
import type { ReactNode } from "react";

const navLinks = [
  { to: "/proyectos", label: "Proyectos" },
  { to: "/equipos", label: "Equipos" },
  { to: "/chat", label: "Chat" },
];

type MainLayoutProps = {
  children: ReactNode;
  fullWidth?: boolean;
  contentClassName?: string;
};

function getLinkClasses(isActive: boolean) {
  const base = "transition-colors";
  return isActive ? `${base} font-semibold` : `${base} text-neutral-600 hover:text-black`;
}

export function MainLayout({
  children,
  fullWidth = false,
  contentClassName = "",
}: MainLayoutProps) {
  const location = useLocation();
  const widthClass = fullWidth ? "max-w-6xl" : "max-w-4xl";

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <header className="border-b-2 border-black bg-white">
        <nav className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6">
          <Link to="/dashboard" className="text-2xl font-bold tracking-tight">
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
          <Link
            to="/configuracion"
            className={getLinkClasses(
              location.pathname === "/configuracion" ||
                location.pathname.startsWith("/configuracion/"),
            )}
          >
            Configuración
          </Link>
        </nav>
      </header>
      <main className="flex flex-1 justify-center px-6 py-10">
        <div className={`w-full ${widthClass} ${contentClassName}`.trim()}>{children}</div>
      </main>
    </div>
  );
}

