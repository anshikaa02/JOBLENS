import { useRef, useState, type DragEvent } from "react";
import { UploadCloud, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFileSelected: (file: File) => void;
  accept?: string;
  selectedFileName?: string | null;
  disabled?: boolean;
}

export default function FileDropzone({
  onFileSelected,
  accept = "application/pdf",
  selectedFileName,
  disabled,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border-2 border-dashed px-6 py-12 text-center transition-colors",
        isDragging ? "border-brass-400 bg-brass-500/5" : "border-ink-700 hover:border-ink-600",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
        }}
      />
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brass-500/12 text-brass-400">
        {selectedFileName ? <FileText size={20} /> : <UploadCloud size={20} />}
      </div>
      {selectedFileName ? (
        <p className="text-sm font-medium text-text-hi">{selectedFileName}</p>
      ) : (
        <>
          <p className="text-sm text-text-mid">
            Drag & drop your resume PDF here, or click to browse
          </p>
          <p className="text-xs text-text-muted">PDF only, up to 5MB</p>
        </>
      )}
    </div>
  );
}
