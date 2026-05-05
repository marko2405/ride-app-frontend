/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuthResponse } from "../api/auth/auth";
import { getMyProfile, type UserProfileResponse } from "../api/profile/profile";
import { getApiErrorMessage } from "../utils/apiError";
import { getStoredToken, getStoredUser } from "../utils/auth";

export type CurrentUser = Omit<UserProfileResponse, "createdAt"> & {
  createdAt?: string;
};

type UserContextType = {
  user: CurrentUser | null;
  loading: boolean;
  error: string;
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>;
  setAuthenticatedUser: (authUser: AuthResponse) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const mapAuthResponseToUser = (authUser: AuthResponse): CurrentUser => ({
  id: authUser.userId,
  firstName: authUser.firstName,
  lastName: authUser.lastName,
  email: authUser.email,
  username: authUser.username,
  role: authUser.role,
  enabled: authUser.enabled,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(() => {
    const storedUser = getStoredUser();
    return storedUser ? mapAuthResponseToUser(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshUser = async () => {
    if (!getStoredToken()) {
      setUser(null);
      setLoading(false);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await getMyProfile();
      setUser(res);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const setAuthenticatedUser = (authUser: AuthResponse) => {
    setUser(mapAuthResponseToUser(authUser));
    setError("");
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        refreshUser,
        setUser,
        setAuthenticatedUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
}
