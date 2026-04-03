import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../utils/auth";
import "../index.css";

function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const result = signupUser(form);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/signin");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Sign up to access your finance dashboard</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              className="toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn">
            Sign Up
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;