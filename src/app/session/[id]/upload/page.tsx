"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage({ params }: { params: { id: string } }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sessionId = params.id; // ✅ Use this instead of searchParams

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      // ✅ Use sessionId from route param
      router.push(`/session/${sessionId}`);
    } else {
      alert(data.error || "Upload failed");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Resume</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Uploading..." : "Upload & Extract"}
      </button>
    </div>
  );
}
