"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileUp, File as FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFileAccepted: (file: File) => void;
  file: File | null;
}

export function FileDropzone({ onFileAccepted, file }: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        "border-gray-300 dark:border-gray-600",
        "hover:border-gray-500 dark:hover:border-gray-400",
        "hover:bg-gray-50 dark:hover:bg-gray-800/50",
        isDragActive
          ? "border-primary bg-primary/10"
          : "bg-white dark:bg-gray-900"
      )}
    >
      <input {...getInputProps()} />
      {file ? (
        <div className="flex flex-col items-center gap-2 text-gray-700 dark:text-gray-300">
          <FileIcon className="w-12 h-12" />
          <p className="font-medium">{file.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {(file.size / 1024).toFixed(2)} KB
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
          <FileUp className="w-12 h-12" />
          <p className="font-semibold">
            {isDragActive
              ? "Drop the file here..."
              : "Drag 'n' drop a PDF here, or click to select"}
          </p>
          <p className="text-sm">Only a single PDF file is accepted</p>
        </div>
      )}
    </div>
  );
}
