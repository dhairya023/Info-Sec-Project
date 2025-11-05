"use client";

import { useCallback } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { FileUp, File as FileIcon, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFileAccepted: (file: File) => void;
  file: File | null;
  accept: Accept;
  operation: "lock" | "unlock";
}

export function FileDropzone({ onFileAccepted, file, accept, operation }: FileDropzoneProps) {
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
    accept,
    maxFiles: 1,
  });

  const getHelperText = () => {
    if (operation === 'lock') {
        return "Only a single PDF file is accepted";
    }
    return "Only .bin files are accepted for unlocking";
  }

  const getTitleText = () => {
    if (isDragActive) {
        return "Drop the file here...";
    }
    if (operation === 'lock') {
        return "Drag 'n' drop a PDF here, or click to select";
    }
    return "Drag 'n' drop an encrypted .bin file here";
  }


  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        "border-gray-500/30",
        "hover:border-purple-400/50",
        "hover:bg-purple-900/20",
        isDragActive
          ? "border-primary bg-primary/20"
          : "bg-transparent"
      )}
    >
      <input {...getInputProps()} />
      {file ? (
        <div className="flex flex-col items-center gap-2 text-gray-200">
          <FileIcon className="w-12 h-12" />
          <p className="font-medium">{file.name}</p>
          <p className="text-sm text-gray-400">
            {(file.size / 1024).toFixed(2)} KB
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-gray-400">
          {operation === 'lock' ? <FileUp className="w-12 h-12" /> : <Unlock className="w-12 h-12" />}
          <p className="font-semibold text-gray-300">
            {getTitleText()}
          </p>
          <p className="text-sm">{getHelperText()}</p>
        </div>
      )}
    </div>
  );
}
