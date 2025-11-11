import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("proyectos", "routes/proyectos.tsx"),
  route("proyecto/:id", "routes/proyecto.$id.tsx"),
  route("equipos", "routes/equipos.tsx"),
  route("equipo/:id", "routes/equipo.$id.tsx"),
  route("chat", "routes/chat.tsx"),
  route("configuracion", "routes/configuracion.tsx"),
] satisfies RouteConfig;
