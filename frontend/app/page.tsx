"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import getApiUrl from "@/constants/endpoints";
import axios from "axios";

const LoginPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const { setUser } = useAuthContext();
  const [userLogged, setUserLogged] = useState<boolean>(false);

  useEffect(() => {
    if (session?.user) {
      const name = session.user.name ?? "";
      const email = session.user.email ?? "";
      const image = session.user.image ?? "";
      setUser({ name, email, image });
      router.push("/dashboard");
    }
    else {
      setUserLogged(true)
    }
  }, [session]);

  async function handleEmailPasswordLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post(getApiUrl("login"), {
        email,
        password,
      });

      const user = res.data;
      setUser(user);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login failed", error);
      alert("Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <>{
      userLogged &&
      <>
        <header className="header">
          <div className="logo">🌟 MyApp</div>
          <button className="loginBtn" onClick={() => setShowLogin(true)}>
            Login
          </button>
        </header>

        <main className="main">
          {!showLogin ? (
            <div className="infoBox">
              <h1>Welcome to MyApp</h1>
              <p>This is some random info or promotional text.</p>
            </div>
          ) : (
            <div className="formContainer">
              <h2>Sign In</h2>
              <form onSubmit={handleEmailPasswordLogin} className="form">
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </form>
              <div className="separator">or</div>

              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="googleBtn"
              >
                Sign in with Google
              </button>
            </div>
          )}
        </main>
      </>
    }
    </>
  );
};

export default LoginPage;
