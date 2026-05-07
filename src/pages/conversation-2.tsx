import { useEffect, useRef, useState } from "react";
import { Check, ChevronRight, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { nanoid } from "nanoid";
import { ChangTopBar } from "@/components/chang/top-bar";
import { ChangComposer } from "@/components/chang/composer";
import { MessageBubble, ThinkingBubble } from "@/components/chang/message-bubble";
import { type Message, getChangResponse } from "@/store/chat-store";
import { cn } from "@/lib/utils";

const DOCS = [
  "Căn cước công dân 2 mặt (Hình ảnh/PDF)",
  "Hồ sơ có dấu của bệnh viện (Hình ảnh/PDF)",
  "Hoá đơn thanh toán (Hình ảnh/PDF)",
];

export function Conversation2Page() {
  const [checked, setChecked] = useState<boolean[]>(DOCS.map(() => false));
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isThinking]);

  function toggle(i: number) {
    setChecked((c) => c.map((v, idx) => (idx === i ? !v : v)));
  }

  function handleSend(text: string, files?: File[]) {
    if (isThinking) return;
    const attachments = files?.map((f) => ({
      name: f.name,
      type: f.type,
      objectUrl: URL.createObjectURL(f),
    }));
    setMessages((m) => [...m, { id: nanoid(), role: "user", content: text, attachments }]);
    setIsThinking(true);
    const res = getChangResponse(text);
    setTimeout(() => {
      setIsThinking(false);
      setMessages((m) => [...m, { id: nanoid(), role: "chang", content: res.content, tasks: res.tasks }]);
    }, 1800);
  }

  return (
    <>
      <ChangTopBar />
      <div className="flex-1 min-w-0 overflow-y-auto px-3 py-3 flex flex-col gap-3 no-scrollbar md:px-6 md:max-w-2xl md:mx-auto md:w-full">
        <div className="w-full shrink-0 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold truncate">
          Công việc: Bồi thường bảo hiểm của PhongNT
        </div>

        <div className="self-end max-w-[78%] bg-muted text-foreground rounded-2xl tail-r px-4 py-2.5 text-[15px]">
          Tôi cần bồi thường bảo hiểm cho PhongNT31.
        </div>

        <button className="self-start inline-flex items-center gap-2 text-[15px] hover:text-primary transition-colors">
          <Check size={16} className="text-success" />
          <span>Xem suy nghĩ</span>
          <ChevronRight size={14} className="text-muted-foreground" />
        </button>

        <p className="w-full shrink-0 text-[15px] leading-6 px-1">
          Em đã tạo Công việc: Bồi thường bảo hiểm của PhongNT31. Anh giúp em
          cung cấp các giấy tờ liên quan nhé!
        </p>

        {/* Task card with checklist */}
        <div className="w-full shrink-0 rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 text-[15px] font-medium border-b border-border">
            Dịch vụ nhân sự
          </div>
          <div className="p-3 flex items-start gap-3 border-b border-border">
            <div className="w-12 h-12 rounded-lg bg-destructive/15 text-destructive flex items-center justify-center shrink-0">
              <Upload size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[15px] leading-tight">
                Bồi thường bảo hiểm của PhongNT31
              </div>
              <div className="text-[13px] text-muted-foreground mt-1">
                Đang chờ anh PhongNT31 cung cấp các giấy tờ liên quan.
              </div>
            </div>
          </div>

          {DOCS.map((doc, i) => (
            <motion.div
              key={i}
              layout
              onClick={() => toggle(i)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-[14px] cursor-pointer transition-colors hover:bg-muted/50",
                i < DOCS.length - 1 && "border-b border-border border-dashed",
                checked[i] && "opacity-60",
              )}
            >
              <span className="flex-1">{doc}</span>
              <motion.div
                animate={{ scale: checked[i] ? 1 : 0.85 }}
                className={cn(
                  "w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors",
                  checked[i]
                    ? "bg-success border-success"
                    : "border-border bg-background",
                )}
              >
                {checked[i] && (
                  <Check size={12} className="text-white" strokeWidth={3} />
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic messages */}
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isThinking && <ThinkingBubble key="thinking" />}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      <ChangComposer onSend={handleSend} disabled={isThinking} />
    </>
  );
}
