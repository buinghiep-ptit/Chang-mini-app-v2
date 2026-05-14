---
description: Triết lý cốt lõi khi viết và sửa code — Think before, Simplicity, Surgical, Goal-driven
globs:
alwaysApply: true
---

# Clean Code & Mindset

> Triết lý cốt lõi khi viết và sửa code trong dự án. Áp dụng cho cả AI và người.

## 1. Think Before Coding

- Nêu rõ assumption. Không chắc → **hỏi**, không tự đoán.
- Nhiều cách hiểu → trình bày các phương án, không tự chọn im lặng.
- Có cách đơn giản hơn → nói ra, phản biện khi cần.

## 2. Simplicity First

- Không thêm feature ngoài yêu cầu.
- Không tạo abstraction cho code chỉ dùng **một lần**.
- Quy tắc 3: 3 dòng lặp lại không phải lý do để abstract. Chờ pattern lặp lần thứ 3 trở lên.
- Không error handling cho scenario không thể xảy ra (xem `error-handling.md`).
- Nếu viết 200 dòng mà có thể là 50 → viết lại.
- Không tối ưu sớm (`useMemo`/`useCallback` chỉ khi đo được vấn đề).

## 3. Surgical Changes

Khi sửa code đã có:

- **Không** "cải thiện" code xung quanh, format, đổi tên không liên quan.
- **Không** refactor thứ không bị lỗi.
- **Match style hiện tại**, dù bạn có thể làm khác.
- Phát hiện dead code không liên quan → **nhắc, không xóa**.
- Khi thay đổi tạo orphan (import/var/function thừa do **thay đổi của mình**): xoá. Dead code có sẵn → để yên.

**Kiểm tra cuối:** mỗi dòng thay đổi phải truy xuất được về yêu cầu người dùng.

## 4. Goal-Driven Execution

Task nhiều bước → state plan ngắn trước khi code:

```
1. [Step] → verify: [check cụ thể]
2. [Step] → verify: [check cụ thể]
```

Tiêu chí thành công rõ ràng → tự loop verify cho đến khi đúng.

## 5. YAGNI / KISS / DRY (đúng liều)

- **YAGNI**: chưa cần thì không xây.
- **KISS**: ưu tiên đọc dễ hơn ngắn lạ.
- **DRY có giới hạn**: trùng cấu trúc bề mặt nhưng khác ngữ nghĩa → **đừng gộp**. Gộp sai tệ hơn lặp.

## 6. Tránh

- ❌ Comment giải thích WHAT (tên đã rõ)
- ❌ "Sẽ refactor sau" — TODO không bao giờ làm
- ❌ Wrapper 1 dòng không thêm giá trị
- ❌ Feature flag cho code có thể xoá thẳng
- ❌ Tạo file mới khi sửa file cũ là đủ

## 7. Khi không chắc

Thứ tự lựa chọn:

1. Đọc code hiện có (đã có pattern chưa?).
2. Đọc `.claude/rules/` (đã có rule chưa?).
3. Đọc `docs/` (đã có quyết định chưa?).
4. **Hỏi người dùng.** Đừng đoán.
