// authService.ts (Actualizado con fetchAuthenticated y getProfile)
import type { LoginRequest, LoginResponse, ApiError, TokenResponse } from "../types/auth";
// Necesitas importar los tipos del perfil de usuario (ASUMIDO que se creará types/user.ts)
import type { UserProfileResponse } from "../types/user"; 

const API_URL = "https://pmaster.elcilantro.site/api"; 

async function fetchAuthenticated(path: string, method: "GET" | "POST" | "PUT" | "DELETE", body?: any): Promise<any> {
    try {
        const token = await getFreshToken(); // Obtener el token de seguridad (JWT)
        
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Usar el token para la autorización
        };

        const config: RequestInit = {
            method: method,
            headers: headers,
            body: body ? JSON.stringify(body) : undefined,
        };

        const response = await fetch(`${API_URL}/${path}`, config);

        if (response.status === 401) {
            // Si el token falló o expiró, redirigir al login
            localStorage.clear();
            window.location.href = "/login";
            throw new Error("Sesión expirada o no autorizada.");
        }

        if (!response.ok) {
            const errorData: ApiError = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error en la solicitud: ${response.status}`);
        }

        // Devolver JSON si existe contenido (GET/POST exitosos)
        if (response.status === 204 || response.headers.get("Content-Length") === "0") {
            return null; // No Content
        }

        return response.json();

    } catch (error) {
        console.error("Error en fetchAuthenticated:", error);
        throw error; 
    }
}

// Función para iniciar sesión (EXISTENTE)
export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al iniciar sesión");
  }

  return response.json();
}

// Función para obtener un token fresco (EXISTENTE)
export async function getFreshToken(): Promise<string> {
  const userKey = localStorage.getItem("userKey");

  if (!userKey) {
    // Si no hay userKey, no hay sesión válida, redirigir inmediatamente
    localStorage.clear();
    window.location.href = "/login"; 
    throw new Error("No hay sesión activa (Falta userKey)");
  }
  
  const response = await fetch(`${API_URL}/login/getToken`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "user_key": userKey, 
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
        // Redirigir si la userKey es inválida o expiró
        localStorage.clear();
        window.location.href = "/login"; 
    }
    throw new Error("No se pudo obtener el token de seguridad");
  }

  const data: TokenResponse = await response.json();
  return data.token;
}

export async function getProfile(): Promise<UserProfileResponse> {
    // Usa la nueva función fetchAuthenticated
    return fetchAuthenticated("user/profile", "GET");
}