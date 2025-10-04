import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://book-review-task-6.onrender.com/api/auth/signup", { name, email, password });
      console.log("Signup response:", res.data);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error.response?.data || error);
      alert(error.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-3xl font-bold mb-6">Sign Up</h2>
      <form onSubmit={handleSignup} className="flex flex-col gap-4 w-80">
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required className="p-2 border rounded" />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="p-2 border rounded" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="p-2 border rounded" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Sign Up</button>
      </form>
      <p className="mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 underline">
          Login
        </Link>
      </p>
    </div>
  );
}

export default Signup;
