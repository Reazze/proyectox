export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    foto_perfil?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    role?: string;
    name?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}