"use client";

import { useState } from "react";
import ResumeUpload from "./components/resumeUpload";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div>
      {/* resume upload component */}
      <ResumeUpload file={file} setFile={setFile} />
    </div>
  );
}
