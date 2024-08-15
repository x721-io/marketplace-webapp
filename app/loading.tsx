"use client";

import { ClipLoader } from "react-spinners";

export default function LoadingPage() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <ClipLoader size={20} />
    </div>
  );
}
