"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";

export type User = {
  name: string;
  email: string;
  image: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<UserContextType>({
  user: null,
  setUser: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (session?.user) {
      const {
        name = "",
        email = "",
        image = "",
      } = session.user as { name?: string | null; email?: string | null; image?: string | null };
      setUser({
        name: name ?? "",
        email: email ?? "",
        image: image ?? "",
      });
    } else {
      setUser(null);
    }
  }, [session]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
