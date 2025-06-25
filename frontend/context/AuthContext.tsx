// "use client";
// import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
// import type { Session } from "@auth/core/types"; // or from "next-auth"
// import { auth } from "@/auth";
// import axios from "axios";
// import getApiUrl from "@/constants/endpoints";

// // interface SessionUser {
// //   name: string;
// //   email: string;
// //   image?: string;
// // }

// // interface Session {
// //   user: SessionUser;
// // }

// export type User = {
//   name: string,
//   email: string;
//   image: string;
// }

// // export const AuthContext = createContext<Session | null | undefined>(undefined);

// interface UserContextProps {
//   user: User | null;
//   setUser: Dispatch<SetStateAction<User | null>>;
//   mutate: () => Promise<void>;
//   loading: boolean;

// }

// const AuthContext = createContext<UserContextProps>({
//   user: null,
//   setUser: () => null,
//   mutate: async () => { },
//   loading: true,

// });

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const mutate = async () => {
//     try {
//       // const User= await auth()
//       // console.log(User)
//       const response = await axios.post(getApiUrl("login"), { idToken: "idToken" });
//       if (response) {
//         setUser(response.data);
//       }
//     } catch (error) {
//       setUser(null);
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <AuthContext.Provider value={{ user, setUser, mutate, loading }}>{children}</AuthContext.Provider>
//   );
// };

// export const useAuthContext = () => useContext(AuthContext);
"use client";

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
