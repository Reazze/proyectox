import type { AuthRepository } from "../repositories/AuthRepository";
import type { AuthResponse, LoginCredentials } from "../entities/User";

export const loginUser = async (
  authRepository: AuthRepository,
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    return await authRepository.login(credentials);
  } catch (error) {
    console.error("Error in login use case:", error);
    throw error;
  }
};
