// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import FormButton from "../components/FormButton";
import { register } from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await register(registerData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: response.data.email,
          fullName: response.data.fullName,
          role: response.data.role,
        })
      );
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Already have an account?"
      linkText="Sign in"
      onLinkClick={() => navigate("/login")}
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <Input
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="John Doe"
          label="Full Name"
          required
          icon="👤"
        />

        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          label="Email Address"
          required
          icon="📧"
        />

        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="+1 (555) 000-0000"
          label="Phone Number"
          icon="📱"
        />

        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          label="Password"
          required
          icon="🔒"
        />

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          label="Confirm Password"
          required
          icon="🔒"
        />

        <div className="flex items-start">
          <input
            type="checkbox"
            required
            className="mt-1 rounded text-orange-500 focus:ring-orange-500"
          />
          <label className="ml-2 text-sm text-gray-700">
            I agree to the{" "}
            <a
              href="#"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Privacy Policy
            </a>
          </label>
        </div>

        <FormButton text="Create Account" loading={loading} />
      </form>
    </AuthLayout>
  );
}
