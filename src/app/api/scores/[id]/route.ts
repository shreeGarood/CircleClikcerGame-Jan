import { db } from "@/utils/firebaseConfig";
import { doc, updateDoc ,deleteDoc} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { score } = await request.json();
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
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
