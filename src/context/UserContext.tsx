import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getMyProfile, type UserProfileResponse } from "../api/profile/profile";

type UserContextType = {
  user: UserProfileResponse | null;
  loading: boolean;
  error: string;
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserProfileResponse | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);
/* eslint-disable */
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refreshUser = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMyProfile();
      setUser(res);
    } catch (err) {
      setError("Failed to load profile.");
      setUser(null);
    } finally {
      setLoading(false);
    }
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
