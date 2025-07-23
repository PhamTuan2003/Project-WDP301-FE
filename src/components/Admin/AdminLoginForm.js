import React from "react";
import "./AdminStyle.css"; // nếu ông vẫn dùng file CSS cũ

export default function AdminLoginForm() {
  return (
    <div
      className="admin-login-background"
      style={{
        background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
        backgroundImage: 'url("/images/background-admin-login.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
    <div className="admin-login-wrapper">
      <form action="#">
        <h2>Login Form</h2>

        <div className="admin-login-input-field">
          <input type="text" required />
          <label>Enter your email</label>
        </div>

        <div className="admin-login-input-field">
          <input type="password" required />
          <label>Enter your password</label>
        </div>

        <div className="admin-login-forget">
          <label htmlFor="remember">
            <input type="checkbox" id="remember" />
            <p>Remember me</p>
          </label>
          <a href="#">Forgot password?</a>
        </div>

        <button type="submit">Log In</button>
      </form>
    </div>
    </div>
  );
}
