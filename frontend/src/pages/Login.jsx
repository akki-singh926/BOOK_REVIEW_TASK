import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://book-review-task-6.onrender.com/api/auth/login", { email, password });
      console.log("Login response:", res.data);
      login(res.data.token,res.data.user); // store token only
      navigate("/"); // redirect to home
    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      alert(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-3xl font-bold mb-6">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Login
        </button>
      </form>
      <p className="mt-4">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-500 underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default Login;
