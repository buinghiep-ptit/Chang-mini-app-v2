import { useState } from 'react'
import { ArrowUp, Check, ChevronRight, Paperclip, Upload, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { ChangTopBar } from '@/components/chang/top-bar'
import { cn } from '@/lib/utils'

const DOCS = [
  'Căn cước công dân 2 mặt (Hình ảnh/PDF)',
  'Hồ sơ có dấu của bệnh viện (Hình ảnh/PDF)',
  'Hoá đơn thanh toán (Hình ảnh/PDF)',
]

export function Conversation2Page() {
  const [checked, setChecked] = useState<boolean[]>(DOCS.map(() => false))
  const [uploadOpen, setUploadOpen] = useState(true)
  const [dragging, setDragging] = useState(false)
  const [uploaded, setUploaded] = useState<string[]>([])

  function toggle(i: number) {
    setChecked(c => c.map((v, idx) => idx === i ? !v : v))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const files = Array.from(e.dataTransfer.files)
    setUploaded(u => [...u, ...files.map(f => f.name)])
    if (files.length) setUploadOpen(false)
  }

  return (
    <>
      <ChangTopBar />
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3 no-scrollbar md:px-6 md:max-w-2xl md:mx-auto md:w-full">
        <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold truncate">
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

        <p className="text-[15px] leading-6 px-1">
          Em đã tạo Công việc: Bồi thường bảo hiểm của PhongNT31. Anh giúp em cung cấp các giấy tờ liên quan nhé!
        </p>

        {/* Task card with checklist */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 text-[15px] font-medium border-b border-border">Dịch vụ nhân sự</div>
          <div className="p-3 flex items-start gap-3 border-b border-border">
            <div className="w-12 h-12 rounded-lg bg-destructive/15 text-destructive flex items-center justify-center shrink-0">
              <Upload size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[15px] leading-tight">Bồi thường bảo hiểm của PhongNT31</div>
              <div className="text-[13px] text-muted-foreground mt-1">Đang chờ anh PhongNT31 cung cấp các giấy tờ liên quan.</div>
            </div>
          </div>

          {DOCS.map((doc, i) => (
            <motion.div
              key={i}
              layout
              onClick={() => toggle(i)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-[14px] cursor-pointer transition-colors hover:bg-muted/50',
                i < DOCS.length - 1 && 'border-b border-border border-dashed',
                checked[i] && 'opacity-60',
              )}
            >
              <span className="flex-1">{doc}</span>
              <motion.div
                animate={{ scale: checked[i] ? 1 : 0.85 }}
                className={cn(
                  'w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors',
                  checked[i] ? 'bg-success border-success' : 'border-border bg-background',
                )}
              >
                {checked[i] && <Check size={12} className="text-white" strokeWidth={3} />}
              </motion.div>
            </motion.div>
          ))}

          {uploaded.length > 0 && (
            <div className="px-4 py-3 flex flex-wrap gap-2 border-t border-border">
              {uploaded.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-success/10 text-success text-[12px]">
                  <Check size={11} strokeWidth={3} />{f}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload + composer block */}
      <div className="px-3 pt-2 pb-3 border-t border-border bg-background flex flex-col gap-2 shrink-0 md:max-w-2xl md:mx-auto md:w-full">
        {uploadOpen && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 py-2.5 flex items-center text-[14px] font-medium border-b border-border">
              <span>Tải lên nội dung</span>
              <button onClick={() => setUploadOpen(false)} className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            </div>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={cn(
                'py-6 flex flex-col items-center gap-1.5 border-b border-border transition-colors cursor-pointer',
                dragging ? 'bg-primary/5 border-primary/30' : 'hover:bg-muted/50',
              )}
            >
              <div className={cn('w-10 h-10 rounded-full flex items-center justify-center transition-colors', dragging ? 'bg-primary/15 text-primary' : 'bg-muted')}>
                <Upload size={20} />
              </div>
              <div className="text-[15px] font-medium">Tải nội dung</div>
              <div className="text-[12px] text-muted-foreground">Nhấn hoặc kéo nội dung cần tải</div>
            </div>
            <div className="flex items-center gap-2 px-4 py-3">
              <span className="text-sm text-muted-foreground flex-1">Nhập câu hỏi cho Chang…</span>
              <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <ArrowUp size={16} />
              </button>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            <Paperclip size={15} />
          </button>
          <button className="px-3 h-7 rounded-full border border-dashed border-primary/40 text-[12px] text-primary font-medium hover:bg-primary/5 transition-colors">Apps</button>
          <button className="px-3 h-7 rounded-full border border-dashed border-border text-[12px] text-muted-foreground hover:bg-muted transition-colors">Công việc</button>
          <span className="text-[10px] text-muted-foreground ml-auto">⇧ + ↵</span>
        </div>
      </div>
    </>
  )
}
