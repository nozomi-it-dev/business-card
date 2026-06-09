import { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";

import Header from "../components/header";
import Template from "../components/template";
import Navigation from "../components/navigation";

import { useSetCards } from "../hooks/setCard";
import { useGetCards } from "../hooks/getCard";
import { downloadCard } from "../hooks/download";

const MASTER_PASSWORD = import.meta.env.VITE_MASTER_PASSWORD;

function Home() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { createCard, updateCard } = useSetCards();
  const { cards, isLoading } = useGetCards();
  const templateRef = useRef(null);

  const [editingId, setEditingId] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [formData, setFormData] = useState({
    full_name_th: "",
    full_name_en: "",
    position: "",
    tel: "",
    email: "",
  });

  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  useEffect(() => {
    const savedPassword = Cookies.get("master_password");
    if (savedPassword === MASTER_PASSWORD) {
      setIsAuthorized(true);
    }
  }, []);

  useEffect(() => {
    if (location.state?.cardData) {
      const { id: cardId, ...data } = location.state.cardData;
      setFormData(data);
      setOriginalData(data);
      setEditingId(cardId);
      return;
    }

    if (id && !isLoading) {
      const card = cards.find((c) => c.id === id);
      if (card) {
        const { id: cardId, ...data } = card;
        setFormData(data);
        setOriginalData(data);
        setEditingId(cardId);
      }
      return;
    }

    if (!id) {
      setFormData({
        full_name_th: "",
        full_name_en: "",
        position: "",
        tel: "",
        email: "",
      });
      setOriginalData(null);
      setEditingId(null);
    }
  }, [location.state, id, cards, isLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tel") {
      const onlyNums = value.replace(/[^\d]/g, "");

      if (onlyNums.length <= 10) {
        let formattedTel = "";

        if (onlyNums.length <= 3) {
          formattedTel = onlyNums;
        } else if (onlyNums.length <= 6) {
          formattedTel = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
        } else {
          formattedTel = `${onlyNums.slice(0, 3)}-${onlyNums.slice(
            3,
            6
          )}-${onlyNums.slice(6)}`;
        }

        setFormData((prevState) => ({ ...prevState, [name]: formattedTel }));
      }
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleViewCard = () => {
    if (editingId) {
      navigate(`/card/${editingId}`, {
        state: { cardData: { id: editingId, ...formData } },
      });
    }
  };

  const handleDownload = async () => {
    if (!templateRef.current) return;

    setIsDownloading(true);

    try {
      await downloadCard(templateRef.current, formData);
      alert("Business card download completed.");
    } catch (error) {
      console.error("Error downloading card:", error);
      alert("Failed to download card. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === MASTER_PASSWORD) {
      Cookies.set("master_password", passwordInput, { expires: 7 });
      setIsAuthorized(true);
      setShowPasswordPopup(false);
      setPasswordInput("");
    } else {
      alert("The password is incorrect.");
    }
  };

  const handleAction = async () => {
    if (!isAuthorized) {
      setShowPasswordPopup(true);
      return;
    }

    try {
      if (editingId) {
        await updateCard(editingId, formData);
        alert("Data updated successfully.");
        setOriginalData(formData);
      } else {
        await createCard(formData);
        alert("Card created successfully.");
        setFormData({
          full_name_th: "",
          full_name_en: "",
          position: "",
          tel: "",
          email: "",
        });
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during recording.");
    }
  };

  const isLoadingCard = !!id && isLoading && !location.state?.cardData;

  const isFormComplete = Object.values(formData).every(
    (value) => value.trim() !== ""
  );

  const formErrors = {
    tel: formData.tel && formData.tel.replace(/\D/g, "").length !== 10
      ? "Phone number must be 10 digits"
      : null,
    email: formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ? "Invalid email address"
      : null,
  };

  const isFormValid = !formErrors.tel && !formErrors.email;

  const hasChanges = originalData
    ? JSON.stringify(formData) !== JSON.stringify(originalData)
    : false;

  if (isLoadingCard) {
    return (
      <div className="layout">
        <Header isAuthorized={isAuthorized} onLockClick={() => setShowPasswordPopup(true)} />
        <div className="loading-state">
          <Loader2 size={24} className="spinner" />
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="layout">
      <Header isAuthorized={isAuthorized} onLockClick={() => setShowPasswordPopup(true)} />
      <div
        ref={templateRef}
        onClick={handleViewCard}
        style={{ cursor: editingId ? "pointer" : "default" }}
      >
        <Template data={formData} enableGpsLink={false} />
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <label className="field">
          <span>Full Name (Thai)</span>
          <input
            type="text"
            name="full_name_th"
            placeholder="ชื่อ-นามสกุล"
            value={formData.full_name_th}
            onChange={handleChange}
          />
        </label>
        <label className="field">
          <span>Full Name (English)</span>
          <input
            type="text"
            name="full_name_en"
            placeholder="First Last"
            value={formData.full_name_en}
            onChange={handleChange}
          />
        </label>
        <label className="field">
          <span>Position</span>
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={formData.position}
            onChange={handleChange}
          />
        </label>
        <div className="field-row">
          <label className="field">
            <span>Tel.</span>
            <input
              type="tel"
              name="tel"
              placeholder="xxx-xxx-xxxx"
              value={formData.tel}
              onChange={handleChange}
              className={formErrors.tel ? "input-error" : ""}
            />
            {formErrors.tel && <span className="field-error">{formErrors.tel}</span>}
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="text"
              name="email"
              placeholder="example@nozomi.co.th"
              value={formData.email}
              onChange={handleChange}
              className={formErrors.email ? "input-error" : ""}
            />
            {formErrors.email && <span className="field-error">{formErrors.email}</span>}
          </label>
        </div>
      </form>

      <div className="botton-group">
        {!editingId ? (
          isFormComplete && isFormValid && (
            <button onClick={handleAction}>
              CREATE
            </button>
          )
        ) : (
          <>
            <button onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? "DOWNLOADING..." : "DOWNLOAD"}
            </button>
            {isAuthorized && (
              <button onClick={handleAction} disabled={!hasChanges}>
                UPDATE
              </button>
            )}
          </>
        )}
      </div>

      {showPasswordPopup && (
        <div className="ios-overlay" onClick={() => { setShowPasswordPopup(false); setPasswordInput(""); }}>
          <div className="ios-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="ios-dialog-body">
              <p className="ios-dialog-title">Authorization Required</p>
              <p className="ios-dialog-message">Enter the password to create and manage business cards.</p>
              <input
                className="ios-dialog-input"
                type="password"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                autoFocus
              />
            </div>
            <div className="ios-dialog-actions">
              <button
                className="ios-dialog-btn"
                onClick={() => { setShowPasswordPopup(false); setPasswordInput(""); }}
              >
                Cancel
              </button>
              <button
                className="ios-dialog-btn"
                onClick={handlePasswordSubmit}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}

export default Home;
