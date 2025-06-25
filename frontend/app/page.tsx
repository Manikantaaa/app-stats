"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

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
    else{
      setUserLogged(true)
    }
  }, [session]);

  async function handleEmailPasswordLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      // Replace with your actual login API call
      // Example: const res = await axios.post('/api/login', { email, password });
      // Simulate login success for demonstration:
      // On success, set user and redirect
      setUser({ name: email.split("@")[0], email, image: "" });
      // Optionally, show a toast or notification here
      router.push("/dashboard");
    } catch (error) {
      // Optionally, show an error toast or notification here
      // Example: toast.error("Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <>{
      userLogged &&
    
    <div className="wrapper">
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
    </div>
}
</>
  );
};

export default LoginPage;
