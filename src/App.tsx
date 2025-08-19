import { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import toast from "react-hot-toast";
import supabaseClient from "./utils/supabase";
import type { User } from "@supabase/supabase-js";
import { APP_CONFIG } from "./config/app";
import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import UpdatePasswordPage from "./components/UpdatePasswordPage";
import HomePage from "./components/HomePage";
import CharactersPage from "./components/CharactersPage";


function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session and listen for auth changes
  useEffect(() => {
    // Get initial session
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Error signing in:", error.message);
      return { error: error.message };
    } else {
      console.log("Sign in successful.");
      return { error: null };
    }
  };

  // Sign up with email/password
  const signUp = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: APP_CONFIG.getRedirectUrl('/'),
      },
    });
    if (error) {
      console.error("Error signing up:", error.message);
      return { error: error.message };
    } else {
      console.log(
        "Sign up successful! Please check your email for verification."
      );
      return { error: null };
    }
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      return { error: error.message };
    } else {
      console.log("Sign out successful.");
      setUser(null);
      return { error: null };
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    // todo: extract hard-coded basename 'mirDB' to a config or env variable
    const redirectTo = APP_CONFIG.getRedirectUrl('/update-password');
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo,
    });
    if (error) {
      console.error("Error resetting password:", error.message);
      return { error: error.message };
    } else {
      console.log("Password reset email sent.\nRedirecting to ", redirectTo);
      return { error: null };
    }
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    const { error } = await supabaseClient.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      console.error("Error updating password:", error.message);
      return { error: error.message };
    } else {
      console.log("Password updated successfully.");
      return { error: null };
    }
  };

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading...</div>;
  }

  return (
    <Router>
      <div>
        <Header user={user} signOut={signOut} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/characters" element={<CharactersPage />} />
            <Route
              path="/login"
              element={
                <LoginPage signIn={signIn} signUp={signUp} user={user} />
              }
            />
            <Route
              path="/forgot-password"
              element={<ForgotPasswordPage resetPassword={resetPassword} />}
            />
            <Route
              path="/update-password"
              element={<UpdatePasswordPage updatePassword={updatePassword} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

