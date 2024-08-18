import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <p>Üzgünüz, aradığınız sayfa bulunamadı.</p>
        <button onClick={handleGoHome}>Ana Sayfaya Dön</button>
      </div>
    </div>
  );
};

export default NotFound;
