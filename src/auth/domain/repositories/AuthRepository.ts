import type { User, LoginCredentials, RegisterData, AuthResponse } from "../entities/User";

export interface AuthRepository {
    login(credentials: LoginCredentials): Promise<AuthResponse>;
    logout(): Promise<void>;
    register(data: RegisterData): Promise<AuthResponse>;
    getCurrentUser(): Promise<User | null>;
}