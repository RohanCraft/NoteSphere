import React, { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaStickyNote,
  FaFolderOpen,
  FaLock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { toast } from "react-toastify";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
} from "firebase/auth";

const Login = () => {
  const [page, setPage] = useState("signIn");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password.");
      return;
    }
    if (page === "signUp" && !name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    try {
      if (page === "signIn") {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Login successful!");
      } else {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length > 0) {
          toast.error("Email already registered. Please login.");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await updateProfile(userCredential.user, { displayName: name });
        toast.success("Account created successfully!");
      }

      setTimeout(() => navigate("/notes"), 500);
    } catch (err) {
      console.error("Firebase error:", err);

      switch (err.code) {
        case "auth/email-already-in-use":
          toast.error("This email is already registered. Please login.");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email format.");
          break;
        case "auth/invalid-credential":
          toast.error("Incorrect email or password.");
          break;
        case "auth/weak-password":
          toast.error("Password should be at least 6 characters.");
          break;
        case "auth/too-many-requests":
          toast.error("Too many failed attempts. Try again later.");
          break;
        default:
          toast.error(err?.message || "Something went wrong!");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Transparent blur background */}
      <div className="fixed inset-0 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 w-full max-w-3xl grid md:grid-cols-2 gap-6">
        {/* Left side: Feature panel */}
        <div className="hidden md:flex flex-col justify-center bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-gray-200 shadow-lg space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome to NoteSphere!
          </h2>
          <p className="text-gray-600 text-sm">
            Designed and built by <strong>Rohan Kumar Sahoo</strong>, NoteApp
            helps you manage your personal notes easily and securely.
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FaStickyNote className="text-blue-600 text-xl" />
              <span>Create and edit notes quickly</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaFolderOpen className="text-green-600 text-xl" />
              <span>Organize notes by categories</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaLock className="text-red-600 text-xl" />
              <span>Secure and private storage</span>
            </div>
          </div>
        </div>

        {/* Right side: Login/Signup form */}
        <div
          className="bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg p-8
                        transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            {page === "signIn" ? "Login to NoteApp" : "Create your account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {page === "signUp" && (
              <input
                type="text"
                placeholder="Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-md transition-shadow"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-md transition-shadow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-md pr-10 transition-shadow"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium
                         shadow-sm hover:shadow-md transition-all"
            >
              {page === "signIn" ? "Login" : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6 text-sm">
            {page === "signIn" ? (
              <>
                Don&apos;t have an account?{" "}
                <span
                  onClick={() => setPage("signUp")}
                  className="text-blue-600 hover:underline cursor-pointer font-medium"
                >
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => setPage("signIn")}
                  className="text-blue-600 hover:underline cursor-pointer font-medium"
                >
                  Login
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
