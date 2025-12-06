// Lo que enviamos al servidor
export interface LoginRequest {
  email: string;
  password: string;
}

// Lo que el servidor nos responde si todo sale bien (Código 200)
export interface LoginResponse {
  userID: number;
  userKey: string;     
  role: string;        
  tempPassword: boolean; 
}

// Lo que responde si falla (Código 401)
export interface ApiError {
  message: string;
}

// Respuesta al pedir un token nuevo
export interface TokenResponse {
  token: string;
}