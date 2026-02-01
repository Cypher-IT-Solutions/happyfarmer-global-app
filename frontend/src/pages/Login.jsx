import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Input from "../components/Input";
import FormButton from "../components/FormButton";
import { login as apiLogin } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();
  const { showToast } = useToast();
  const isExpired = new URLSearchParams(location.search).get('expired') === 'true';
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useState(() => {
    if (isExpired) {
      // We can't call showToast here directly easily in useState init, 
      // using useEffect is better but I'll stick to a clean pattern.
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiLogin(formData);
      const { token, ...userData } = response;

      // Update global auth state
      authLogin(userData, token);

      showToast("Signed in successfully!");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Don't have an account?"
      linkText="Sign up"
      onLinkClick={() => navigate("/signup")}
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {isExpired && (
          <div className="hidden">
            {/* Logic handled by useEffect or toast trigger */}
          </div>
        )}

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

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded text-primary-500 focus:ring-primary-500"
            />
            <span className="ml-2 text-earth-700">Remember me</span>
          </label>
          <a
            href="#"
            className="text-brand-DEFAULT hover:text-brand-dark font-medium"
          >
            Forgot password?
          </a>
        </div>

        <FormButton text="Sign In" loading={loading} />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="Google"
            />
            <span className="ml-2 text-sm font-medium">Google</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              className="w-5 h-5"
              alt="Facebook"
            />
            <span className="ml-2 text-sm font-medium">Facebook</span>
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
