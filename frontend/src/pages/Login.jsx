
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SocialLogins from "../components/SocialLogins";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Login failed");
        return;
      }

      // Save token in localStorage (or context)
      localStorage.setItem("token", data.token);

    
      // Navigate to profile page
      navigate("/dashboard");
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="flex-1 p-10 flex flex-col justify-center items-start">
        <h1 className="text-4xl font-bold mb-6">Welcome back</h1>

        {/* Email */}
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          className="input"
        />

        {/* Password */}
        <label className="mt-4">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
          className="input"
        />

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Buttons */}
        <div className="flex justify-between items-center w-full mt-2">
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="mr-2" />
            Remember me
          </label>
          <Link to="#" className="text-blue-600 text-sm">Forgot password?</Link>
        </div>

        <button onClick={handleLogin}  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">Sign in</button>

        <p className="mt-4 text-center w-full">
          Don't have an account? <Link to="/signup" className="text-blue-600">Sign up</Link>
        </p>

        <div className="divider">Or sign in with</div>

        <SocialLogins />
      </div>

      <div className="hidden md:flex flex-1 bg-gray-100 justify-center items-center">
        <img src="/illustration.png" alt="Illustration" className="max-w-md" />
      </div>
    </div>
  );
}
