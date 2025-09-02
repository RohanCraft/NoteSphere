import React, { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaStickyNote,
  FaFolderOpen,
  FaLock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { toast } from "react-toastify";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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

        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: name,
          email: email,
          createdAt: new Date(),
        });

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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
      {/* Abstract illustration background */}
      <div className="absolute inset-0 z-0">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Soft floating shapes */}
          <circle cx="15%" cy="25%" r="120" fill="#60a5fa" opacity="0.3" />
          <circle cx="85%" cy="10%" r="200" fill="#3b82f6" opacity="0.2" />
          <circle cx="70%" cy="70%" r="180" fill="#93c5fd" opacity="0.15" />
          <rect
            x="10%"
            y="75%"
            width="120"
            height="120"
            fill="#bfdbfe"
            rx="20"
            opacity="0.2"
          />
          <rect
            x="50%"
            y="40%"
            width="150"
            height="80"
            fill="#60a5fa"
            rx="15"
            opacity="0.1"
          />
        </svg>

        {/* Optional floating icons */}
        <div className="absolute top-20 left-10 text-blue-400 text-3xl opacity-20 animate-pulse">
          <FaStickyNote />
        </div>
        <div className="absolute top-1/2 right-16 text-green-400 text-4xl opacity-20 animate-bounce">
          <FaFolderOpen />
        </div>
        <div className="absolute bottom-20 left-1/3 text-red-400 text-3xl opacity-20 animate-pulse">
          <FaLock />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-3xl grid md:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-center bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome to NoteSphere!
          </h2>
          <p className="text-gray-600 text-sm">
            Manage your personal notes easily and securely.
          </p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FaStickyNote className="text-blue-600 text-lg" />
              <span>Create and edit notes quickly</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaFolderOpen className="text-green-600 text-lg" />
              <span>Organize notes by categories</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaLock className="text-red-600 text-lg" />
              <span>Secure and private storage</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div
          className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8
                        transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          {/* Mobile Description */}
          <div className="md:hidden mb-4 text-center text-gray-700">
            <h3 className="text-lg font-semibold mb-1">
              Welcome to NoteSphere!
            </h3>
            <p className="text-sm">
              Securely manage your personal notes anywhere.
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            {page === "signIn" ? "Login to NoteApp" : "Create your account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {page === "signUp" && (
              <input
                type="text"
                placeholder="Name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-md transition-shadow"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-md transition-shadow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
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

          <p className="text-center text-gray-600 mt-4 text-sm">
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
