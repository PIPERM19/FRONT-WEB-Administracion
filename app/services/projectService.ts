import { getFreshToken } from "./authService";
import type { 
  Project, CreateProjectBody, CreateProjectResponse, GetProjectsResponse,
  ProjectMember, GetMembersResponse,
  Team, GetTeamsResponse,
  Module, GetModulesResponse,
  Task, GetTasksResponse,
  ApiMessageResponse
} from "../types/projects";

// URL REAL
const API_URL = "https://pmaster.elcilantro.site/api"; 

// Función genérica para solicitudes autenticadas
async function fetchAuthenticated(
  endpoint: string, 
  method: "GET" | "POST", 
  body?: any,
  customHeaders?: Record<string, string>
) {
  const token = await getFreshToken();
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...customHeaders 
    },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_URL}/${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error en ${endpoint} (Status: ${response.status})`);
  }
  return response.json();
}

// PROYECTOS
export async function getProjects(): Promise<Project[]> {
  const data: GetProjectsResponse = await fetchAuthenticated("project", "GET");
  return data.projects;
}

export async function createProject(data: CreateProjectBody): Promise<string> {
  const res: CreateProjectResponse = await fetchAuthenticated("project", "POST", data);
  return res.projectID;
}

// MIEMBROS
export async function getProjectMembers(projectId: string): Promise<ProjectMember[]> {
  const data: GetMembersResponse = await fetchAuthenticated(
    "project/getMembers", "GET", undefined, 
    { "project_id": projectId } 
  );
  return data.members;
}

export async function addProjectMember(projectId: string, userId: number): Promise<ApiMessageResponse> {
  return fetchAuthenticated("project/addMember", "POST", { project_id: projectId, user_id: userId });
}

export async function removeProjectMember(projectId: string, userId: number): Promise<ApiMessageResponse> {
  return fetchAuthenticated("project/removeMember", "POST", { project_id: projectId, user_id: userId });
}

// EQUIPOS
export async function getProjectTeams(projectId: string): Promise<Team[]> {
  const data: GetTeamsResponse = await fetchAuthenticated(
    "project/getTeams", "GET", undefined, 
    { "project_id": projectId } 
  );
  return data.teams;
}

export async function createProjectTeam(projectId: string, name: string, description: string): Promise<ApiMessageResponse> {
  return fetchAuthenticated("project/createTeam", "POST", { project_id: projectId, name, description });
}

export async function updateProjectTeam(projectId: string, teamId: number, name: string, description: string): Promise<ApiMessageResponse> {
  return fetchAuthenticated("project/updateTeam", "POST", { project_id: projectId, team_id: teamId, name, description });
}

export async function removeProjectTeam(projectId: string, teamId: number): Promise<ApiMessageResponse> {
  return fetchAuthenticated("project/removeTeam", "POST", { project_id: projectId, team_id: teamId });
}

// MÓDULOS
export async function getProjectModules(projectId: string): Promise<Module[]> {
  const data: GetModulesResponse = await fetchAuthenticated(
    "project/getModules", "GET", undefined, 
    { "project_id": projectId } 
  );
  return data.modules;
}

export async function createProjectModule(projectId: string, title: string, description: string, priority: string, status: string): Promise<ApiMessageResponse> {
  return fetchAuthenticated("project/createModule", "POST", { 
    project_id: projectId, title, description, priority, status 
  });
}

export async function updateProjectModule(projectId: string, moduleId: number, title: string, description: string, priority: string, status: string, teamIds: number): Promise<ApiMessageResponse> {
  return fetchAuthenticated("project/updateModule", "POST", { 
    project_id: projectId, module_id: moduleId, title, description, priority, status, team_ids: teamIds 
  });
}

export async function removeProjectModule(projectId: string, moduleId: number): Promise<ApiMessageResponse> {
  return fetchAuthenticated("project/removeModule", "POST", { project_id: projectId, module_id: moduleId });
}

// TAREAS
export async function getModuleTasks(projectId: string, moduleId: number): Promise<Task[]> {
  const data: GetTasksResponse = await fetchAuthenticated(
    "project/getTasks", "GET", undefined, 
    { "project_id": projectId, "module_id": moduleId.toString() } 
  );
  return data.tasks;
}

export async function createTask(projectId: string, moduleId: number, title: string, description: string, priority: string, status: string, userIds?: number): Promise<ApiMessageResponse> {
  return fetchAuthenticated("project/createTask", "POST", { 
    project_id: projectId, module_id: moduleId, title, description, priority, status, user_ids: userIds 
  });
}

export async function updateTask(projectId: string, moduleId: number, taskId: number, title: string, description: string, priority: string, status: string, userIds?: number): Promise<ApiMessageResponse> {
  return fetchAuthenticated("project/updateTask", "POST", { 
    project_id: projectId, module_id: moduleId, task_id: taskId, title, description, priority, status, user_ids: userIds 
  });
}

export async function removeTask(projectId: string, moduleId: number, taskId: number): Promise<ApiMessageResponse> {
  return fetchAuthenticated("project/removeTask", "POST", { 
    project_id: projectId, module_id: moduleId, task_id: taskId 
  });
}