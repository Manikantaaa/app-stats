"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import getApiUrl from "@/constants/endpoints";
import axios from "axios";

const menuItems = [
  { label: "User Module", path: "/dashboard" },
  { label: "App Module", path: "/app-management" },
  { label: "User-App Module", path: "/user-app-management" },
  { label: "Graphs Module", path: "/graph-analytics" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<number | null>(null);
  const session = useAuthContext();
  const [userLogged, setUserLogged] = useState<boolean>(false);

  useEffect(() => {
    const fetchRole = async () => {
      if (!session?.user) {
        router.push("/");
      } else {
        try {
          const res = await axios.get(getApiUrl("role"), {
            params: { email: session.user.email }, 
          });
          if (res.data?.u_role) {
            setRole(res.data.u_role);
          }
          setUserLogged(true);
        } catch (err) {
          console.error("Error fetching role:", err);
        }
      }
    };

    fetchRole();
  }, [session, router]);

  const user = session?.user;

  return (
    <>
      {userLogged && (
        <aside className="sidebar">
          {role === 1 ? (
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
              <li className={pathname === "/app-stats" ? "active" : ""}>
                <Link href="/app-stats">App Stats</Link>
              </li>
            </ul>
          )}
        </aside>
      )}
    </>
  );
}
