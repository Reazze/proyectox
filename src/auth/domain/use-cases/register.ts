import type { AuthRepository } from "../repositories/AuthRepository";
import type { AuthResponse, RegisterData } from "../entities/User";

export const registerUser = async (
  authRepository: AuthRepository,
  data: RegisterData
): Promise<AuthResponse> => {
  try {
    return await authRepository.register(data);
  } catch (error) {
    console.error("Error in register use case:", error);
    throw error;
  }
};
