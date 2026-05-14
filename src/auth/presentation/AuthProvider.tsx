import { createContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from "../domain/entities/User";
import { AuthApi } from "../infraestructure/api/authApi";
import { loginUser } from "../domain/use-cases/login";
import { registerUser } from "../domain/use-cases/register";
import { getCurrentUser } from "../domain/use-cases/getCurrentUser";
import { logoutUser } from "../domain/use-cases/logout";
import AuthModal from "./AuthModal";

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeAuthModal: () => void;
  authModalMode: "none" | "login" | "register";
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authApi = useMemo(() => new AuthApi(), []);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalMode, setAuthModalMode] = useState<"none" | "login" | "register">("none");

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser(authApi);
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, [authApi]);

  const openLoginModal = () => setAuthModalMode("login");
  const openRegisterModal = () => setAuthModalMode("register");
  const closeAuthModal = () => setAuthModalMode("none");

  const login = async (credentials: LoginCredentials) => {
    const response = await loginUser(authApi, credentials);
    setUser(response.user);
    setAuthModalMode("none");
    return response;
  };

  const register = async (data: RegisterData) => {
    const response = await registerUser(authApi, data);
    setUser(response.user);
    setAuthModalMode("none");
    return response;
  };

  const logout = async () => {
    await logoutUser(authApi);
    setUser(null);
  };

  return (
    <>
      <AuthContext.Provider
        value={{
          user,
          loading,
          login,
          register,
          logout,
          openLoginModal,
          openRegisterModal,
          closeAuthModal,
          authModalMode,
        }}
      >
        {children}
      </AuthContext.Provider>
      <AuthModal
        mode={authModalMode}
        onClose={closeAuthModal}
        onSwitchMode={setAuthModalMode}
        onLogin={login}
        onRegister={register}
      />
    </>
  );
};

export default AuthProvider;
