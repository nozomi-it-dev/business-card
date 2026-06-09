import { collection, addDoc, doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "./firebase";

export const useSetCards = () => {
  const createCard = async (data) => {
    try {
      const docRef = await addDoc(collection(db, "card"), data);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error("Error creating card: ", error);
      throw error;
    }
  };

  const updateCard = async (id, data) => {
    try {
      const docRef = doc(db, "card", id);
      await updateDoc(docRef, data);
      return { id, ...data };
    } catch (error) {
      console.error("Error updating card: ", error);
      throw error;
    }
  };

  const deleteCards = async (ids) => {
    try {
      const batch = writeBatch(db);
      ids.forEach((id) => batch.delete(doc(db, "card", id)));
      await batch.commit();
    } catch (error) {
      console.error("Error deleting cards: ", error);
      throw error;
    }
  };

  return { createCard, updateCard, deleteCards };
};
