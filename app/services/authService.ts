import type { LoginRequest, LoginResponse, ApiError, TokenResponse } from "../types/auth";

const API_URL = "https://pmaster.elcilantro.site/api"; 

// Función para iniciar sesión
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

// Función para obtener un token fresco
export async function getFreshToken(): Promise<string> {
  const userKey = localStorage.getItem("userKey");

  if (!userKey) {
    throw new Error("No hay sesión activa (Falta userKey)");
  }
// Realizar la solicitud para obtener un token fresco
  const response = await fetch(`${API_URL}/login/getToken`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "user_key": userKey, 
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
       localStorage.clear();
       window.location.href = "/login"; 
    }
    throw new Error("No se pudo obtener el token de seguridad");
  }

  // Procesar la respuesta y devolver el token
  const data: TokenResponse = await response.json();
  return data.token;
}