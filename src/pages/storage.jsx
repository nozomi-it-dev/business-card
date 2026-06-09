import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight, Loader2, Check } from "lucide-react";
import Cookies from "js-cookie";

import Header from "../components/header";
import Navigation from "../components/navigation";

import { useGetCards } from "../hooks/getCard";
import { useSetCards } from "../hooks/setCard";

const MASTER_PASSWORD = import.meta.env.VITE_MASTER_PASSWORD;

const THAI_CONSONANTS = /[ก-ฮ]/;
const TITLE_PREFIX = /^(ดร\.|นาย|นาง(?:สาว)?|Dr\.|Mr\.|Mrs\.|Ms\.)\s*/i;

function getInitials(nameEn, nameTh) {
  const raw = nameEn || nameTh || "";
  const cleaned = raw.replace(TITLE_PREFIX, "").trim();
  const parts = cleaned.split(/\s+/);

  const isThai = /[฀-๿]/.test(raw);

  if (isThai) {
    const firstConsonant = (str) => {
      for (const ch of str) {
        if (THAI_CONSONANTS.test(ch)) return ch;
      }
      return str[0] || "";
    };
    const a = firstConsonant(parts[0] || "");
    const b = parts.length > 1 ? firstConsonant(parts[parts.length - 1]) : "";
    return a + b;
  }

  const a = (parts[0]?.[0] || "").toUpperCase();
  const b = parts.length > 1 ? (parts[parts.length - 1]?.[0] || "").toUpperCase() : "";
  return a + b;
}

function Storage() {
  const { cards, isLoading, refetch } = useGetCards();
  const { deleteCards } = useSetCards();
  const navigate = useNavigate();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [query, setQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (Cookies.get("master_password") === MASTER_PASSWORD) {
      setIsAuthorized(true);
    }
  }, []);

  const filtered = cards.filter((card) => {
    const q = query.toLowerCase();
    return (
      card.full_name_en?.toLowerCase().includes(q) ||
      card.full_name_th?.toLowerCase().includes(q) ||
      card.position?.toLowerCase().includes(q)
    );
  });

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedIds(new Set());
  };

  const handleDelete = async () => {
    if (selectedIds.size === 0) return;
    setIsDeleting(true);
    try {
      await deleteCards([...selectedIds]);
      setSelectedIds(new Set());
      setIsEditing(false);
      refetch();
    } catch {
      alert("Failed to delete. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCardClick = (card) => {
    if (isEditing) {
      toggleSelect(card.id);
      return;
    }
    navigate(`/${card.id}`, { state: { cardData: card } });
  };

  return (
    <div className="layout">
      <Header />
      <div className="cards-section">
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search people, roles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="loading-state">
            <Loader2 size={24} className="spinner" />
          </div>
        ) : (
          <>
            <div className="card-total-row">
              <p className="card-total">ALL &nbsp; {filtered.length}</p>
              {isEditing ? (
                <div className="edit-actions">
                  <button className="btn-text" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                  <button
                    className="btn-destructive"
                    onClick={handleDelete}
                    disabled={selectedIds.size === 0 || isDeleting}
                  >
                    {isDeleting ? "Deleting..." : `Delete${selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}`}
                  </button>
                </div>
              ) : (
                isAuthorized && (
                  <button className="btn-text" onClick={() => setIsEditing(true)}>
                    Edit
                  </button>
                )
              )}
            </div>

            <div className="card-list">
              {filtered.map((card) => (
                <div
                  className={`card-item ${selectedIds.has(card.id) ? "card-item--selected" : ""}`}
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                >
                  {isEditing && (
                    <div className={`card-select ${selectedIds.has(card.id) ? "card-select--on" : ""}`}>
                      {selectedIds.has(card.id) && <Check size={11} color="white" strokeWidth={3} />}
                    </div>
                  )}
                  <div className="card-avatar">
                    {getInitials(card.full_name_en, card.full_name_th)}
                  </div>
                  <div className="card-info">
                    <p className="card-name">
                      {card.full_name_en || card.full_name_th || "Unnamed"}
                    </p>
                    <p className="position">{card.position || "No Position"}</p>
                  </div>
                  {!isEditing && (
                    <ChevronRight size={16} style={{ opacity: 0.4, flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <Navigation />
    </div>
  );
}

export default Storage;
