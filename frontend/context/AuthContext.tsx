"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
// import { useSession } from "next-auth/react";
import axios from "axios";
import getApiUrl from "@/constants/endpoints";

export type User = {
  id: number;
  name: string;
  email: string;
  image: string;
  userApps: [];
  role:number
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
  // const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const verifiedEmail= localStorage.getItem("email");
      const fetchdata = async() => {
      const res = await axios.post(getApiUrl("verify"), {
        email:verifiedEmail
      });
      const user = res.data;
      setUser(user);
    }
    if(verifiedEmail !=null ){
      fetchdata();
    }

    // if (user) {
    //   const {
    //     id = 0,
    //     name = "",
    //     email = "",
    //     image = "",
    //     role = 2,
    //   } = user as { id?: number; name?: string | null; email?: string | null; image?: string | null; role?: number | null };
    //   setUser({
    //     id: id ?? 0,
    //     name: name ?? "",
    //     email: email ?? "",
    //     image: image ?? "",
    //     userApps: user.userApps ?? [],
    //     role: role ?? 2,
    //   });
    // } else {
    //   setUser(null);
    // }

  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
