import { db } from "@/utils/firebaseConfig";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";

// PATCH Route
export async function PATCH(request: Request, context: { params: Record<string, string> }) {
  try {
    const { id } = context.params; // Access the dynamic parameter
    const { score } = await request.json(); // Get data from the request body
    const scoreDoc = doc(db, "scores", id);
    await updateDoc(scoreDoc, { score });
    return NextResponse.json({ message: "Score updated successfully", id, score });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}

// DELETE Route
export async function DELETE(request: Request, context: { params: Record<string, string> }) {
  try {
    const { id } = context.params; // Access the dynamic parameter
    const scoreDoc = doc(db, "scores", id);
    await deleteDoc(scoreDoc);
    return NextResponse.json({ message: "Score deleted successfully", id });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
