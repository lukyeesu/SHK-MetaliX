---
name: shk-business-logic
description: "Core business logic, quota management, and domain rules for SHK-MetaliX application"
---

# SHK-MetaliX Business Logic

This skill documents the core domain logic, specific workarounds, and database conventions for the SHK-MetaliX project. Always read and refer to this before making changes to billing, quotas, or stock logic.

## 1. Quota & Billing Logic (Multiple Quotas per Bill)
- **Concept:** "วันที่ทำรายการ" (Transaction Date) determines the **buy price** for the day. However, one bill can draw its weight limit (quota) from **multiple lock dates**.
- **Rule:** A single bill MUST have the same transaction date (e.g., 22/6/2026). If the weight of the bill exceeds the quota of that day, the user can manually add more quotas (e.g., 23/6/2026) to cover the remaining weight using a "+ เพิ่มวันที่โควต้า" button.
- **Stock Representation:** The system will split the bill into multiple `Stock` entries under the hood (e.g., `id: REC123-1`, `REC123-2`).
- **CRITICAL DATE RULE:** ALL split stock entries MUST use the SAME `date` field (the transaction date of the bill) so they appear on the same day in the stock history. To link them to different quotas, they should use a separate `quotaRefDate` field.
- **Quota Calculation:** The `calculateDynamicQuotas` function must match stock entries against lock limits using the `quotaRefDate` (if it exists), otherwise falling back to the stock's `date`.

## 2. Global State & Function Scoping
- **Rule:** Functions that are used across multiple modal components (like `calculateDynamicQuotas` or `formatDateTh`) must be declared globally (outside the main `App` component) or properly passed down without being trapped in `useCallback` closures that other components cannot access.

## 3. Deletion Protection
- **Rule:** Before writing code to delete files or drop large chunks of logic, MUST ask the user for explicit permission.

## 4. UI / UX Standards
- **Theme:** Blue/Sky tones for Buying (รายจ่าย), Emerald/Green tones for Selling (รายรับ), Amber/Orange for Quotas/Alerts.
- **Design:** Glassmorphism, smooth animations, and clean rounded borders (`rounded-[24px]`).

---
*(Add new logic rules here as the project evolves)*
