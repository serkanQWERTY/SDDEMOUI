import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import "../BuildingConfiguration.css";

Modal.setAppElement("#root");

const BuildingConfiguration = () => {
  const [configurations, setConfigurations] = useState([]);
  const [buildingTypes, setBuildingTypes] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newConfig, setNewConfig] = useState({
    buildingType: "",
    buildingCost: "",
    constructionTime: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBuildingConfigurations();
    fetchBuildingTypes();
  }, []);

  const fetchBuildingConfigurations = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7033/api/ElasticSearch/GetBuildingConfigurationsAsync",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setConfigurations(response.data.dataToReturn);
    } catch (error) {
      console.error("Error fetching building configurations:", error);
    }
  };

  const fetchBuildingTypes = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7033/api/ElasticSearch/GetAllBuildingTypes",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBuildingTypes(response.data.dataToReturn);
    } catch (error) {
      console.error("Error fetching building types:", error);
    }
  };

  const handleAddConfig = async () => {
    const { buildingType, buildingCost, constructionTime } = newConfig;

    if (!buildingType || !buildingCost || !constructionTime) {
      toast.error("Tüm alanlar doldurulmalıdır.");
      return;
    }

    if (Number(buildingCost) <= 0) {
      toast.error("Yapı maliyeti sıfırdan büyük olmalıdır.");
      return;
    }

    if (Number(constructionTime) < 30 || Number(constructionTime) > 1800) {
      toast.error(
        "İnşaat süresi 30 saniyeden az ve 1800 saniyeden fazla olamaz."
      );
      return;
    }

    const buildingTypeId = buildingTypes.find(
      (type) => type.name === buildingType
    )?.id;

    if (buildingTypeId == null) {
      toast.error("Geçersiz yapı türü.");
      return;
    }

    const updatedConfig = {
      ...newConfig,
      buildingType: buildingTypeId,
    };

    try {
      const response = await axios.post(
        "https://localhost:7033/api/ElasticSearch/AddBuildingConfigurationAsync",
        updatedConfig,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(response.data.message);
      setModalIsOpen(false);
      setConfigurations((prevConfigs) => {
        return Array.isArray(prevConfigs)
          ? [...prevConfigs, updatedConfig]
          : [updatedConfig];
      });
    } catch (error) {
      console.error("Error adding building configuration:", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewConfig((prevConfig) => ({ ...prevConfig, [id]: value }));
  };

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://localhost:7033/User/Logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 || response.data.isSuccess) {
        localStorage.removeItem("token");
        navigate("/login");
        toast.success(response.data.message || "Başarıyla çıkış yapıldı.");
      } else {
        toast.error(response.data.message || "Çıkış işlemi başarısız oldu.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      if (error.response) {
        toast.error(
          error.response.data.message ||
            "Bir hata oluştu. Lütfen tekrar deneyin."
        );
      } else {
        toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };

  const getBuildingTypeNameById = (id) => {
    const type = buildingTypes.find((type) => type.id === id);
    return type ? type.name : "Bilinmiyor";
  };

  return (
    <div className="building-configurations-container">
      <table className="configurations-table">
        <thead>
          <tr>
            <th>Yapı Türü</th>
            <th>Yapı Maliyeti</th>
            <th>İnşaat Süresi</th>
          </tr>
        </thead>
        <tbody>
          {configurations && configurations.length > 0 ? (
            configurations.map((config, index) => (
              <tr key={index}>
                <td>{getBuildingTypeNameById(config.buildingType)}</td>
                <td>{config.buildingCost}</td>
                <td>{config.constructionTime}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">Kayıt bulunamadı.</td>
            </tr>
          )}
        </tbody>
      </table>

      <button onClick={handleOpenModal} className="add-config-button">
        Yapı Ekle
      </button>

      <button onClick={handleLogout} className="logout-button">
        Çıkış Yap
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Yeni Yapı Ekle</h2>
        <label htmlFor="buildingType">Yapı Türü</label>
        <select
          id="buildingType"
          value={newConfig.buildingType}
          onChange={handleInputChange}
        >
          <option value="">Seçiniz</option>
          {buildingTypes.map((type) => (
            <option key={type.id} value={type.name}>
              {type.name}
            </option>
          ))}
        </select>
        <label htmlFor="buildingCost">Yapı Maliyeti</label>
        <input
          className="building-cost"
          type="number"
          id="buildingCost"
          value={newConfig.buildingCost}
          onChange={handleInputChange}
        />
        <label htmlFor="constructionTime">İnşaat Süresi (saniye)</label>
        <input
          className="construction-time"
          type="number"
          id="constructionTime"
          value={newConfig.constructionTime}
          onChange={handleInputChange}
        />
        <button className="add-button" onClick={handleAddConfig}>
          Ekle
        </button>
        <button className="close-button" onClick={handleCloseModal}>
          Kapat
        </button>
      </Modal>
    </div>
  );
};

export default BuildingConfiguration;
