import { useNavigate } from "react-router-dom";

import Header from "../components/header";
import Navigation from "../components/navigation";

import { useGetCards } from "../hooks/getCard";

import "../styles/storage.css";

function Storage() {
  const { cards, isLoading } = useGetCards();
  const navigate = useNavigate();

  const handleCardClick = (card) => {
    navigate(`/${card.id}`, { state: { cardData: card } });
  };

  return (
    <div className="layout">
      <Header />
      <div className="card-list">
        {!isLoading &&
          cards.length > 0 &&
          cards.map((card) => (
            <div
              className="card-item"
              key={card.id}
              onClick={() => handleCardClick(card)}
            >
              <p className="position">{card.position || "No Position"}</p>
              <p>{card.full_name_en || "Unnamed"}</p>
            </div>
          ))}
      </div>
      <Navigation />
    </div>
  );
}

export default Storage;
