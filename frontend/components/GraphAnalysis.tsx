"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";



export default function GraphAnalysis() {

  const router = useRouter();
  const { user } = useAuthContext();
  const [userLogged, setUserLogged] = useState<boolean>(false);

   
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
    else {
      setUserLogged(true)
    }
  }, [user, router]);
 

 

 
  

  if (!user) return null;

  return (
    <>
      {userLogged &&
          <div className="table-header">
            <h2>Graph Analysis</h2>
            

          </div>
        }
    </>
  );
}
