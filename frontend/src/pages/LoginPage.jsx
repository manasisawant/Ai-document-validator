import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail ||
            data.message ||
            "Login failed. Please check your credentials."
        );
        return;
      }

      if (!data.access_token) {
        setError("Login succeeded, but no access token was returned.");
        return;
      }

      // Store JWT for authenticated API requests
      localStorage.setItem("access_token", data.access_token);

      if (data.token_type) {
        localStorage.setItem("token_type", data.token_type);
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <Link to="/" className="auth-brand">
          <div className="auth-brand-mark">✓</div>

          <div>
            <strong>DocuVerify</strong>
            <span>AI Document Validation</span>
          </div>
        </Link>

        <div className="auth-header">
          <h1>Welcome back</h1>

          <p>
            Sign in to continue validating and reviewing
            your documents.
          </p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <div className="auth-field">
            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

        </form>

        <div className="auth-footer">
          <span>Don't have an account?</span>

          <Link to="/register">
            Create an account
          </Link>
        </div>

        <Link to="/" className="auth-back">
          ← Back to DocuVerify
        </Link>

      </div>
    </div>
  );
}

export default LoginPage;