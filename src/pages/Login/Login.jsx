import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { WalletContext } from "@/context/WalletContext";

function Login() {
  const [key, setKey] = useState("");
  const { loginWithPrivateKey, account } = useContext(WalletContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = () => {
    try {
      loginWithPrivateKey(key);
      setError("");
      navigate("/dashboard");
    } catch (e) {
      setError("⚠️ Private key không hợp lệ!");
    }
  };

  return (
    <div className="login-container">
      <form
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <h2 className="login-title">Đăng nhập bằng Private Key</h2>

        <input
          type="password"
          placeholder="Nhập private key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="login-input"
        />

        {error && <div className="login-error">{error}</div>}

        <button type="submit" className="login-button">
          Đăng nhập
        </button>

        {account && (
          <p className="login-success">🟢 Đã đăng nhập: {account.address}</p>
        )}
      </form>
    </div>
  );
}

export default Login;
