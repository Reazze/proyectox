import type { AuthRepository } from "../repositories/AuthRepository";
import type { User } from "../entities/User";

export const getCurrentUser = async (
  authRepository: AuthRepository
): Promise<User | null> => {
  try {
    return await authRepository.getCurrentUser();
  } catch (error) {
    console.error("Error in getCurrentUser use case:", error);
    throw error;
  }
};
