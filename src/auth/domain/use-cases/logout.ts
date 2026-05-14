import type { AuthRepository } from "../repositories/AuthRepository";

export const logoutUser = async (authRepository: AuthRepository): Promise<void> => {
  try {
    await authRepository.logout();
  } catch (error) {
    console.error("Error in logout use case:", error);
    throw error;
  }
};
