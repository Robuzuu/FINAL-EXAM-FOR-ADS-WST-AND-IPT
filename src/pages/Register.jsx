import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  
    const pwd = formData.password || "";
    const confirm = formData.confirmPassword || "";
    const hasMin = pwd.length >= 8;
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    if (!hasMin || !hasSpecial) {
      alert("Password must be at least 8 characters and include a special character.");
      return;
    }
    if (pwd !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost/courier/backend/api/user_api.php?action=register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
        setTimeout (err)
      setError("Server error");
    }
  };

  return (
    <div className="flex justify-center items-center py-16">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-600">
          Register
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-800"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-800"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 mb-6 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-800"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full p-3 mb-6 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-800"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-3 mb-6 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-800"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md transition"
        >
          Register
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
