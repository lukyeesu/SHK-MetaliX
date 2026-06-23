---
name: shk-business-logic
description: "Core business logic, quota management, and domain rules for SHK-MetaliX application"
---

# SHK-MetaliX Business Logic

This skill documents the core domain logic, specific workarounds, and database conventions for the SHK-MetaliX project. Always read and refer to this before making changes to billing, quotas, or stock logic.

## 1. Hybrid Quota & Billing Logic (แบบผสม)
- **Concept:** "วันที่ทำรายการ" (Transaction Date) determines the **buy price** for the day. However, one bill can draw its weight limit (quota) from **multiple lock dates**.
- **Rule 1 (Manual Quota Selection):** A single bill MUST have the same transaction date (e.g., 22/6). If the weight exceeds the quota of that day, the user can manually add more quotas (e.g., 23/6) using a "+ เพิ่มโควต้า" button. The system auto-splits the bill's weight across the selected quotas in order.
- **Rule 2 (Auto Carry-Forward):** If the user selects a quota and the bill's weight pushes that quota into the negative, the system allows it to be negative. Once a future lock is added to the system, `calculateDynamicQuotas` will automatically carry forward the negative deficit to the next available chronological lock.
- **Stock Representation:** The system splits the bill into multiple `Stock` entries (e.g., `id: REC123-1`, `REC123-2`).
- **CRITICAL DATE RULE:** ALL split stock entries MUST use the SAME `date` field (the transaction date) so they appear on the same day in the stock history. To link them to different quotas, they use `quotaRefDate`.
- **Quota Calculation:** `calculateDynamicQuotas` must match stock entries using `s.quotaRefDate ? s.quotaRefDate : s.date` and calculate carry-forwards sequentially based on chronological order.

## 2. Global State & Function Scoping
- **Rule:** Functions that are used across multiple modal components (like `calculateDynamicQuotas` or `formatDateTh`) must be declared globally (outside the main `App` component) or properly passed down without being trapped in `useCallback` closures that other components cannot access.

## 3. Deletion Protection
- **Rule:** Before writing code to delete files or drop large chunks of logic, MUST ask the user for explicit permission.

## 4. UI / UX Standards
- **Theme:** Blue/Sky tones for Buying (รายจ่าย), Emerald/Green tones for Selling (รายรับ), Amber/Orange for Quotas/Alerts.
- **Design:** Glassmorphism, smooth animations, and clean rounded borders (`rounded-[24px]`).

---
*(Add new logic rules here as the project evolves)*
