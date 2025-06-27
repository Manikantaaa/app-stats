"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";

const menuItems = [
  { label: "User Module", path: "/dashboard" },
  { label: "App Module", path: "/app-management" },
  { label: "User-App Module", path: "/user-app-management" },
  { label: "Graphs Module", path: "/graph-analytics" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user: authUser } = useAuthContext();
  const [userLogged, setUserLogged] = useState<boolean>(false);

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    } else {
      setUserLogged(true);
    }
  }, [authUser, router]);

  return (
    <>
      {userLogged && (
        <aside className="sidebar">
          {authUser?.role === 1 ? (
            <ul>
              {menuItems.map((item) => (
                <li
                  key={item.path}
                  className={pathname === item.path ? "active" : ""}
                >
                  <Link href={item.path}>{item.label}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <ul>
              <li className={authUser?.role != 1 ? "active" : ""}>
                <Link href="/app-stats">App Stats</Link>
              </li>
            </ul>
          )}
        </aside>
      )}
    </>
  );
}
