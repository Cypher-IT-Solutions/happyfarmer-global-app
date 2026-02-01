import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import FormButton from "../components/FormButton";
import { register } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Signup() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const { showToast } = useToast();
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
      showToast("Passwords do not match", "warning");
      return;
    }

    if (formData.password.length < 8) {
      showToast("Password must be at least 8 characters", "warning");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await register(registerData);
      const { token, ...userData } = response;

      // Auto-login after signup
      authLogin(userData, token);

      showToast("Account created successfully!");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      showToast(msg, "error");
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
            className="mt-1 rounded text-primary-500 focus:ring-primary-500"
          />
          <label className="ml-2 text-sm text-earth-700">
            I agree to the{" "}
            <a
              href="#"
              className="text-brand-DEFAULT hover:text-brand-dark font-medium"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-brand-DEFAULT hover:text-brand-dark font-medium"
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
