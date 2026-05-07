import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import {
  ArrowUp,
  Bot,
  BrainCircuit,
  FileImage,
  FileText,
  Link2,
  Mic,
  Paperclip,
  Upload,
  X,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

// ── File helpers ───────────────────────────────────────────────
function getFileIcon(file: File) {
  if (file.type.startsWith("image/"))
    return <FileImage size={13} className="shrink-0 text-muted-foreground" />;
  if (file.type === "application/pdf")
    return <FileText size={13} className="shrink-0 text-red-500" />;
  return <Link2 size={13} className="shrink-0 text-muted-foreground" />;
}

function getFileBg(file: File) {
  if (file.type === "application/pdf")
    return "bg-red-50 border-red-100 dark:bg-red-950/30 dark:border-red-900/40";
  return "bg-muted/60 border-border";
}

// ── Upload section (rendered inside the unified block) ─────────
interface UploadSectionProps {
  files: File[];
  onAdd: (f: File[]) => void;
  onRemove: (i: number) => void;
  onClose: () => void;
}

function UploadSection({
  files,
  onAdd,
  onRemove,
  onClose,
}: UploadSectionProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onAdd,
    noClick: files.length > 0, // when files exist, only the "add more" sub-zone is clickable
    accept: {
      "image/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
    },
    multiple: true,
  });

  return (
    <div>
      {/* Header */}
      <div className="px-4 py-2.5 flex items-center gap-2 border-b border-border">
        <span className="text-[13px] font-semibold flex-1">
          Tải lên nội dung
        </span>
        <button
          onClick={onClose}
          className="w-5 h-5 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      {files.length === 0 ? (
        /* Empty — full dropzone */
        <div
          {...getRootProps()}
          className={cn(
            "py-6 flex flex-col items-center gap-1.5 cursor-pointer select-none transition-colors",
            isDragActive ? "bg-primary/5" : "hover:bg-muted/30",
          )}
        >
          <input {...getInputProps()} />
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              isDragActive
                ? "bg-primary/15 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            <Upload size={20} />
          </div>
          <span className="text-[14px] font-medium leading-tight">
            Tải nội dung
          </span>
          <span className="text-[12px] text-muted-foreground">
            {isDragActive
              ? "Thả file vào đây…"
              : "Nhấn hoặc kéo nội dung cần tải"}
          </span>
        </div>
      ) : (
        /* Has files — chip grid + "add more" sub-zone */
        <div
          {...getRootProps()}
          className={cn(
            "p-3 flex flex-wrap gap-2 transition-colors",
            isDragActive && "bg-primary/5",
          )}
        >
          <input {...getInputProps()} />
          {files.map((f, i) => (
            <div
              key={i}
              className={cn(
                "relative flex items-center gap-1.5 pl-2.5 pr-6 py-1.5 rounded-sm border text-[12px] max-w-[160px]",
                getFileBg(f),
              )}
            >
              {getFileIcon(f)}
              <span className="truncate">{f.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(i);
                }}
                className="absolute right-1 top-1 w-4 h-4 rounded-full bg-foreground/15 hover:bg-foreground/25 flex items-center justify-center transition-colors"
              >
                <X size={8} className="text-foreground" strokeWidth={3} />
              </button>
            </div>
          ))}
          {/* Add more */}
          <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-dashed border-border text-[12px] text-muted-foreground cursor-pointer hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-colors">
            <Upload size={12} />
            Thêm
            <input {...getInputProps()} className="hidden" />
          </label>
        </div>
      )}

      {/* Divider before input */}
      <div className="border-b border-border" />
    </div>
  );
}

// ── Main Composer ──────────────────────────────────────────────
interface ComposerProps {
  tabs?: boolean;
  onSend?: (text: string, files?: File[]) => void;
  disabled?: boolean;
  className?: string;
}

export function ChangComposer({
  tabs = false,
  onSend,
  disabled,
  className,
}: ComposerProps) {
  const [value, setValue] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { location } = useRouterState();

  // ── Add files (dedup by name) ──
  const addFiles = useCallback((accepted: File[]) => {
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...accepted.filter((f) => !names.has(f.name))];
    });
    setUploadOpen(true);
  }, []);

  // ── Drag onto entire composer ──
  const { getRootProps: getComposerDropProps, isDragActive: isComposerDrag } =
    useDropzone({
      onDrop: addFiles,
      noClick: true,
      noKeyboard: true,
      accept: {
        "image/*": [],
        "application/pdf": [],
        "application/msword": [],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [],
      },
    });

  // ── Clipboard paste ──
  function onPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const imageItems = Array.from(e.clipboardData.items).filter(
      (it) => it.kind === "file" && it.type.startsWith("image/"),
    );
    if (imageItems.length > 0) {
      e.preventDefault();
      const pasted = imageItems
        .map((it) => it.getAsFile())
        .filter(Boolean) as File[];
      addFiles(pasted);
    }
  }

  // ── Auto-resize textarea ──
  function resizeTextarea() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  }

  function onInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
    resizeTextarea();
  }

  // ── Keyboard: Enter = send, Shift+Enter = newline ──
  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
    // Shift+Enter falls through → native newline behaviour
  }

  // ── Send ──
  function send() {
    const text = value.trim();
    if ((!text && files.length === 0) || disabled) return;
    onSend?.(
      text || `[Đính kèm ${files.length} file]`,
      files.length > 0 ? files : undefined,
    );
    setValue("");
    setFiles([]);
    setUploadOpen(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  const canSend = (value.trim().length > 0 || files.length > 0) && !disabled;

  const isApps = location.pathname === "/apps";
  const isTasks = location.pathname === "/tasks";

  return (
    <div
      className={cn(
        "px-3 pt-2 pb-3 bg-background/95 backdrop-blur-sm flex flex-col gap-2 shrink-0",
        // border-t border-border
        className,
      )}
      {...getComposerDropProps()}
    >
      {/* ── Unified block: upload section + input row ── */}
      <div
        className={cn(
          "rounded-xl border bg-card overflow-hidden transition-colors",
          isComposerDrag
            ? "border-primary/60 ring-2 ring-primary/20"
            : "border-border focus-within:border-primary/50",
        )}
      >
        {/* Upload section animates in/out above the input */}
        <AnimatePresence initial={false}>
          {uploadOpen && (
            <motion.div
              key="upload"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <UploadSection
                files={files}
                onAdd={addFiles}
                onRemove={(i) =>
                  setFiles((f) => f.filter((_, idx) => idx !== i))
                }
                onClose={() => setUploadOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input row */}
        <div className="flex items-start gap-2 px-3 pt-2.5 pb-2.5">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={onInput}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            disabled={disabled}
            placeholder="Nhập câu hỏi cho Chang…"
            className={cn(
              "flex-1 resize-none bg-transparent text-[14px] text-foreground leading-5",
              "placeholder:text-muted-foreground placeholder:align-middle",
              "focus:outline-none min-h-[20px] max-h-[140px]",
              "pt-1", // tiny nudge so first-line aligns with button icons
              "disabled:opacity-50",
            )}
          />
          <div className="flex items-center gap-1 shrink-0 self-end pb-0.5">
            <button className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Mic size={15} />
            </button>
            <button
              onClick={send}
              disabled={!canSend}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150",
                canSend
                  ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 scale-100"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-50 scale-90",
              )}
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Chip row ── */}
      <div className="flex items-center gap-2">
        {/* Attach button */}
        <button
          onClick={() => setUploadOpen((o) => !o)}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-colors relative",
            uploadOpen || files.length > 0
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted",
          )}
        >
          <Paperclip size={15} />
          {files.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-[15px] h-[15px] rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center leading-none">
              {files.length}
            </span>
          )}
        </button>

        {tabs ? (
          <>
            <Link
              to="/apps"
              className={cn(
                "px-3 h-7 rounded-full border border-dashed text-[12px] font-medium flex items-center transition-colors",
                isApps
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5",
              )}
            >
              Apps
            </Link>
            <Link
              to="/tasks"
              className={cn(
                "px-3 h-7 rounded-full border border-dashed text-[12px] font-medium flex items-center transition-colors",
                isTasks
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5",
              )}
            >
              Công việc
            </Link>
          </>
        ) : (
          <>
            <button className="px-3 h-7 rounded-full border border-dashed border-border text-[12px] flex items-center gap-1.5 text-muted-foreground hover:bg-muted transition-colors">
              <BrainCircuit size={11} />
              Deep Think: on
            </button>
            <button className="px-3 h-7 rounded-full border border-dashed border-border text-[12px] flex items-center gap-1.5 text-muted-foreground hover:bg-muted transition-colors">
              <Bot size={11} />
              Agent
            </button>
          </>
        )}
        <span className="text-[10px] text-muted-foreground ml-auto hidden sm:block select-none">
          ↵ gửi · ⇧↵ xuống dòng
        </span>
      </div>
    </div>
  );
}
