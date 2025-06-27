"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthContext } from "@/context/AuthContext";
import { signOut } from "next-auth/react"; // ✅ Correct import

const Navbar = () => {
  const router = useRouter();
  const { user } = useAuthContext();
  const [userLogged, setUserLogged] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else {
      setUserLogged(true);
    }
  }, [user, router]);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" }); 
    localStorage.removeItem('email');
  };

  if (!user) return null;

  return (
    <>
      {userLogged && (
        <header className="header">
          <Image
            src={user?.image || "/user.png"}
            alt="User"
            width={40}
            height={40}
            className="user-img"
          />
          <div className="logo">App Dashboard</div>
          <div className="user-info">
            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
      )}
    </>
  );
};

export default Navbar;
