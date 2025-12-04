
// ENTIDADES 

export interface Project {
  id: string; // Es string según tu documentación ("4c5b9072")
  name: string;
  description: string;
  start: string; 
  end: string; 
}

export interface ProjectMember {
  id: number;
  name: string;
}

export interface Team {
  id: number;
  name: string;
  description: string;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  priority: string; 
  status: string; 
  created_at: number;
  updated_at: number;
  team_ids: number; 
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  created_at: number;
  updated_at: number;
  user_ids?: number;
}

// INPUTS 

export interface CreateProjectBody {
  name: string;
  description: string;
  client_id: number;
  team_leader_id: number;
  start: string;
  end: string;
}

// RESPUESTAS DE LA API

// Respuestas Genéricas
export interface ApiMessageResponse {
  message: string;
}

// Respuestas Específicas
export interface GetProjectsResponse {
  projects: Project[];
}

export interface CreateProjectResponse {
  projectID: string;
}

export interface GetMembersResponse {
  members: ProjectMember[];
}

export interface GetTeamsResponse {
  teams: Team[];
}

export interface GetModulesResponse {
  modules: Module[];
}

export interface GetTasksResponse {
  tasks: Task[];
}