import { db } from "@/utils/firebaseConfig";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// POST: Add a new score
export async function POST(request: Request) {
  try {
    const { name, score } = await request.json();
    if (!name || typeof score !== "number") {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    const scoresCollection = collection(db, "scores");
    const docRef = await addDoc(scoresCollection, { name, score });

    console.log("✅ Score added successfully:", { id: docRef.id, name, score });
    return NextResponse.json({ message: "Score added successfully", id: docRef.id, name, score });
  } catch (error) {
    console.error("❌ Error adding score:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

// GET: Retrieve all scores
export async function GET() {
  try {
    const scoresCollection = collection(db, "scores");
    const snapshot = await getDocs(scoresCollection);

    const scores = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("📥 Fetched scores:", scores.length);
    return NextResponse.json(scores);
  } catch (error) {
    console.error("❌ Error fetching scores:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

// DELETE: Remove all scores
export async function DELETE() {
  try {
    const scoresCollection = collection(db, "scores");
    const snapshot = await getDocs(scoresCollection);

    if (snapshot.empty) {
      return NextResponse.json({ message: "No scores to delete." }, { status: 200 });
    }

    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(doc(db, "scores", docSnap.id)));
    await Promise.all(deletePromises);

    console.log("🗑️ All scores deleted successfully.");
    return NextResponse.json({ message: "All scores cleared successfully" });
  } catch (error) {
    console.error("❌ Error deleting scores:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
