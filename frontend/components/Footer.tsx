"use client"
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Footer = () => {
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
  if (!user) return null;

  return (
  <>
      {userLogged && (
        <footer className="footer">© {new Date().getFullYear()} MyApp. All rights reserved.</footer>

      )
      }
      </>
  )}
      export default Footer