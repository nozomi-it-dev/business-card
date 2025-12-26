import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import Template from "../components/template";

import { useGetCards } from "../hooks/getCard";
import { downloadCard } from "../hooks/download";

import "../styles/view.css";

function View() {
  const { id } = useParams();
  const { cards, isLoading } = useGetCards();
  const [formData, setFormData] = useState(null);
  const templateRef = useRef(null);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  useEffect(() => {
    if (!isLoading && cards.length > 0) {
      const card = cards.find((c) => c.id === id);
      if (card) {
        const { id: cardId, ...data } = card;
        setFormData(data);
      }
    }
  }, [id, cards, isLoading]);

  useEffect(() => {
    const autoDownload = async () => {
      if (formData && templateRef.current && !hasDownloaded) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await downloadCard(templateRef.current, formData);
          setHasDownloaded(true);
        } catch (error) {
          console.error("Error auto-downloading card:", error);
        }
      }
    };

    autoDownload();
  }, [formData, hasDownloaded]);

  if (isLoading || !formData) return <div>Loading...</div>;

  return (
    <div className="center-screen" ref={templateRef}>
      <Template data={formData} />
    </div>
  );
}

export default View;
