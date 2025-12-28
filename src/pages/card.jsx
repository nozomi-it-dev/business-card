import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import QRCode from "qrcode";

import Header from "../components/header";
import Template from "../components/template";
import CloseIcon from "../assets/window-close.svg";

import { useGetCards } from "../hooks/getCard";

import "../styles/card.css";

function Card() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { cards, isLoading } = useGetCards();

  const [formData, setFormData] = useState({
    full_name_th: "",
    full_name_en: "",
    position: "",
    tel: "",
    email: "",
  });

  const [selectedCardId, setSelectedCardId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCards, setFilteredCards] = useState([]);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    if (location.state?.cardData) {
      const { id: cardId, ...data } = location.state.cardData;
      setFormData(data);
      setSelectedCardId(cardId);
      return;
    }

    if (id && !isLoading) {
      const card = cards.find((c) => c.id === id);
      if (card) {
        const { id: cardId, ...data } = card;
        setFormData(data);
        setSelectedCardId(cardId);
      }
    }
  }, [location.state, id, cards, isLoading]);

  useEffect(() => {
    if (!isLoading && cards.length > 0) {
      if (searchQuery.trim() === "") {
        setFilteredCards(cards);
      } else {
        const filtered = cards.filter(
          (card) =>
            card.full_name_th
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            card.full_name_en.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCards(filtered);

        if (filtered.length === 1) {
          handleCardSelect(filtered[0].id);
        }
      }
    }
  }, [searchQuery, cards, isLoading]);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const cleanUrl = `${window.location.origin}/view/${selectedCardId}`;
        const qrDataUrl = await QRCode.toDataURL(cleanUrl, {
          width: 300,
          margin: 1,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
        setQrCodeUrl(qrDataUrl);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    if (selectedCardId) {
      generateQRCode();
    }
  }, [selectedCardId]);

  const handleClose = () => {
    if (selectedCardId) {
      navigate(`/${selectedCardId}`);
    } else {
      navigate("/");
    }
  };

  const handleCardSelect = (cardId) => {
    if (!cardId) return;

    const card = cards.find((c) => c.id === cardId);
    if (card) {
      const { id: selectedId, ...data } = card;
      setFormData(data);
      setSelectedCardId(selectedId);

      navigate(`/card/${selectedId}`, {
        replace: true,
        state: { cardData: card },
      });
    }
  };

  const handleDropdownChange = (e) => {
    handleCardSelect(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="landscape">
      <img
        src={CloseIcon}
        alt="Close"
        className="btn-close"
        onClick={handleClose}
      />

      <div className="spacing">
        <Header />
      </div>
      <Template data={formData} />

      <div className="tool">
        {qrCodeUrl ? (
          <img className="qrcode" src={qrCodeUrl} alt="QR Code" />
        ) : (
          <div className="qrcode qrcode-placeholder">
            <p>Generating a QR code...</p>
          </div>
        )}

        <div className="filter">
          <select
            name="cards"
            value={selectedCardId}
            onChange={handleDropdownChange}
            disabled={isLoading}
          >
            {filteredCards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.full_name_th || card.full_name_en || "Unamed"}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  );
}

export default Card;
