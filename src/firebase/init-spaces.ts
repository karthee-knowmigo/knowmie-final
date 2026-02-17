import { getFirestore, doc, collection, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";

const db = getFirestore();

interface BiologyDocument {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  metadata: {
    description?: string;
    visibility: "private" | "shared";
    tags?: string[];
  };
}

export async function initializeUserBiology(userId: string) {
  // Create the user's document in knowmigos collection
  const userRef = doc(db, "knowmigos", userId);
  await setDoc(
    userRef,
    {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  // Create initial Biology document
  const biologyId = nanoid();
  const biologyRef = doc(collection(userRef, "Biology"), biologyId);

  const biologyData: BiologyDocument = {
    id: biologyId,
    title: "Introduction to Biology",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      description: "Getting started with Biology",
      visibility: "private",
      tags: ["biology", "introduction"],
    },
  };

  await setDoc(biologyRef, biologyData);
  return biologyId;
}
