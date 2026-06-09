import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { X, Loader2 } from "lucide-react";

import Header from "../components/header";
import Template from "../components/template";
import Navigation from "../components/navigation";
import { useGetCards } from "../hooks/getCard";

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
    document.body.classList.add("card-view-active");
    return () => document.body.classList.remove("card-view-active");
  }, []);

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
            card.full_name_th.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card.full_name_en.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCards(filtered);
        if (filtered.length === 1) handleCardSelect(filtered[0].id);
      }
    }
  }, [searchQuery, cards, isLoading]);

  useEffect(() => {
    if (!selectedCardId) return;
    const generateQRCode = async () => {
      try {
        const url = `${window.location.origin}/view/${selectedCardId}`;
        const dataUrl = await QRCode.toDataURL(url, {
          width: 600,
          margin: 1,
          color: { dark: "#000000", light: "#FFFFFF" },
        });
        setQrCodeUrl(dataUrl);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };
    generateQRCode();
  }, [selectedCardId]);

  const handleClose = () => {
    navigate(selectedCardId ? `/${selectedCardId}` : "/");
  };

  const handleCardSelect = (cardId) => {
    if (!cardId) return;
    const card = cards.find((c) => c.id === cardId);
    if (card) {
      const { id: selectedId, ...data } = card;
      setFormData(data);
      setSelectedCardId(selectedId);
      navigate(`/card/${selectedId}`, { replace: true, state: { cardData: card } });
    }
  };

  return (
    <div className="card-page">
      <div className="card-header-wrap">
        <Header onClose={handleClose} />
      </div>

      <div className="card-template-area">
        <Template data={formData} />
      </div>

      <button className="card-close-ls" onClick={handleClose}>
        <X size={20} />
      </button>

      <div className="card-side">
        <div className="card-qr">
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="QR Code" />
          ) : (
            <div className="card-qr-placeholder">
              <p>Generating QR code...</p>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="loading-state">
            <Loader2 size={20} className="spinner" />
          </div>
        )}

        <div className="card-filter">
          <select
            value={selectedCardId}
            onChange={(e) => handleCardSelect(e.target.value)}
            disabled={isLoading}
          >
            {filteredCards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.full_name_th || card.full_name_en || "Unnamed"}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Navigation />
    </div>
  );
}

export default Card;
