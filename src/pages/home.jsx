import { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import Header from "../components/header";
import Template from "../components/template";
import Navigation from "../components/navigation";

import { useSetCards } from "../hooks/setCard";
import { useGetCards } from "../hooks/getCard";
import { downloadCard } from "../hooks/download";

import "../styles/home.css";

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

  const handleAction = async () => {
    if (!isAuthorized) {
      if (passwordInput === MASTER_PASSWORD) {
        Cookies.set("master_password", passwordInput, { expires: 7 });
        setIsAuthorized(true);
        alert("Login successful");
        return;
      } else {
        alert("The password is incorrect.");
        return;
      }
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

  const isFormComplete = Object.values(formData).every(
    (value) => value.trim() !== ""
  );

  const hasChanges = originalData
    ? JSON.stringify(formData) !== JSON.stringify(originalData)
    : false;

  return (
    <div className="layout">
      <Header />
      <div
        ref={templateRef}
        onClick={handleViewCard}
        style={{ cursor: editingId ? "pointer" : "default" }}
      >
        <Template data={formData} />
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          name="full_name_th"
          placeholder="Full Name (Thai)"
          value={formData.full_name_th}
          onChange={handleChange}
        />
        <input
          type="text"
          name="full_name_en"
          placeholder="Full Name (English)"
          value={formData.full_name_en}
          onChange={handleChange}
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={formData.position}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="tel"
          placeholder="Tel."
          value={formData.tel}
          onChange={handleChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
      </form>

      <div className="botton-group">
        {!isAuthorized && !editingId ? (
          <>
            <input
              type="password"
              placeholder="Master Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <button onClick={handleAction}>SAVE</button>
          </>
        ) : (
          <>
            {!editingId ? (
              <button onClick={handleAction} disabled={!isFormComplete}>
                CREATE
              </button>
            ) : (
              <>
                <button onClick={handleDownload} disabled={isDownloading}>
                  {isDownloading ? "DOWNLOADING..." : "DOWNLOAD"}
                </button>
                <button
                  onClick={handleAction}
                  disabled={!hasChanges || !isAuthorized}
                >
                  UPDATE
                </button>
              </>
            )}
          </>
        )}
      </div>

      <Navigation />
    </div>
  );
}

export default Home;
