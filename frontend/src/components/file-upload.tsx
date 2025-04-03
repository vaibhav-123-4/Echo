"use client"

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { IconUpload } from "../icons/icons";
import { FileRejection, useDropzone, DropEvent } from "react-dropzone";
import imageCompression from "browser-image-compression";

const MAX_FILE_SIZE_MB = 15; // Max file size in MB

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressFile = async (file: File) => {
    const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Compression error:", error);
      return file; // Return original if compression fails
    }
  };

  const handleFileChange = async (newFiles: File[]) => {
    const validFiles: File[] = [];
    for (let file of newFiles) {
      if (file.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
        alert(`File ${file.name} exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
        continue;
      }
      const compressedFile = await compressFile(file);
      validFiles.push(compressedFile);
    }
    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    onChange && onChange(validFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (fileRejections: FileRejection[], event: DropEvent) => {
      console.log(fileRejections);
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <div
        onClick={handleClick}
        className="p-6 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-300 text-base">Upload file</p>
          <p className="relative z-20 font-sans font-normal text-neutral-400 text-sm mt-2">
            Drag or drop your files here or click to upload (Max {MAX_FILE_SIZE_MB}MB)
          </p>
          <div className="relative w-full mt-6 max-w-xl mx-auto">
            {files.length > 0 &&
              files.map((file, idx) => (
                <div
                  key={"file" + idx}
                  className={cn(
                    "relative overflow-hidden z-40 bg-gray-800 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                    "shadow-sm"
                  )}
                >
                  <div className="flex justify-between w-full items-center gap-4">
                    <p className="text-base text-neutral-300 truncate max-w-xs">{file.name}</p>
                    <p className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-white bg-neutral-700 shadow-input">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-400">
                    <p className="px-1 py-0.5 rounded-md bg-neutral-700">{file.type}</p>
                    <p>modified {new Date(file.lastModified).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            {!files.length && (
              <div
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-gray-800 flex items-center justify-center h-24 mt-4 w-full max-w-[8rem] mx-auto rounded-md border border-dashed border-purple-500/50",
                  "shadow-[0px_5px_15px_rgba(139,92,246,0.1)]"
                )}
              >
                {isDragActive ? (
                  <p className="text-neutral-300 flex flex-col items-center">
                    Drop it
                    <IconUpload className="h-4 w-4 text-neutral-400 mt-1" />
                  </p>
                ) : (
                  <IconUpload className="h-5 w-5 text-neutral-400" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export function GridPattern() {
  const columns = 20;
  const rows = 8;
  return (
    <div className="flex bg-gray-800 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-8 h-8 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-800"
                  : "bg-gray-800 shadow-[0px_0px_1px_1px_rgba(139,92,246,0.1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
