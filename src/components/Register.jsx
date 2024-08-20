import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mailAddress, setMailAddress] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "https://localhost:7033/User/Register",
        {
          name,
          surname,
          username,
          password,
          mailAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast(response.data.message, {
        type: response.data.isSuccess ? "success" : "error",
      });

      if (response.data.isSuccess) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Register Error:", error.response || error.message);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Üye Ol</h2>
        <div className="form-group">
          <label htmlFor="name">Ad</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="surname">Soyad</label>
          <input
            type="text"
            id="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Kullanıcı Adı</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Şifre</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="mailAddress">E-posta Adresi</label>
          <input
            type="email"
            id="mailAddress"
            value={mailAddress}
            onChange={(e) => setMailAddress(e.target.value)}
            required
          />
        </div>
        <button type="submit">Üye Ol</button>
        <button
          type="button"
          className="back-button"
          onClick={handleBackToLogin}
        >
          Giriş Sayfasına Dön
        </button>
      </form>
    </div>
  );
};

export default Register;
