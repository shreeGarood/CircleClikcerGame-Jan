import { db } from "@/utils/firebaseConfig";
import { collection, addDoc, getDocs ,doc,deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

const scoresCollection = collection(db, "scores");

export async function POST(request: Request) {
  try {
    const { name, score } = await request.json();
    const docRef = await addDoc(scoresCollection, { name, score });
    return NextResponse.json({ message: "Score added successfully", id: docRef.id, name, score });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const snapshot = await getDocs(scoresCollection);
    const scores = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(scores);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const snapshot = await getDocs(scoresCollection);

    const deletePromises = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, "scores", docSnap.id))
    );

    await Promise.all(deletePromises);

    return NextResponse.json({ message: "All scores cleared successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
