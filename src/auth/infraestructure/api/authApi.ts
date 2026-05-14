import type { AuthResponse, LoginCredentials, RegisterData, User } from "../../domain/entities/User";
import type { AuthRepository } from "../../domain/repositories/AuthRepository";
import { getToken, removeToken, setToken } from "../authStorage";

const baseUrl = "http://localhost:8000";

export class AuthApi implements AuthRepository {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            throw new Error(errorBody?.message ?? "Login failed");
        }

        const json = await response.json();
        setToken(json.token);
        return json as AuthResponse;
    }

    async logout(): Promise<void> {
        const token = getToken();

        if (!token) {
            removeToken();
            return;
        }

        const response = await fetch(`${baseUrl}/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            throw new Error(errorBody?.message ?? "Logout failed");
        }

        removeToken();
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await fetch(`${baseUrl}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            throw new Error(errorBody?.message ?? "Registration failed");
        }

        const json = await response.json();
        setToken(json.token);
        return json as AuthResponse;
    }

    async getCurrentUser(): Promise<User | null> {
        const token = getToken();
        if (!token) {
            return null;
        }

        const response = await fetch(`${baseUrl}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            removeToken();
            return null;
        }

        const json = await response.json();
        return json.data as User;
    }
}
