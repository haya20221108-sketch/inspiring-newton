import React, { useState } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function AuthView() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">
        {isRegister ? "🎀 新規登録 🎀" : "🎀 ログイン 🎀"}
      </h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>メールアドレス</label>
          <input
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>パスワード</label>
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary full-width">
          {isRegister ? "アカウント作成" : "ログイン"}
        </button>
        <p className="auth-toggle" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "ログインはこちら" : "新規登録はこちら"}
        </p>
      </form>
    </div>
  );
}
