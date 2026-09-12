<instruction>You are an expert software engineer. You are working on a WIP branch. Please run `git status` and `git diff` to understand the changes and the current state of the code. Analyze the workspace context and complete the mission brief.</instruction>
<workspace_context>
<artifacts>
--- CURRENT TASK CHECKLIST ---
# Audit of Bugs, Errors, and Incomplete Implementation

This document lists the issues identified during the initial code review of the `onecaresol` application.

## 🔴 High Priority / Security Issues

### 1. Insecure Password Handling
- **File**: [AddCareGiver.tsx](file:///c:/Users/Lenovo/Desktop/onecaresol/src/pages/AddCareGiver.tsx) (Line 219)
- **Issue**: The `password` field is being directly mapped to `login_code` in the `care_givers` table. 
- **Risk**: Passwords are likely stored in plain text or a reversible format if the database column isn't handled by a specific encryption/hashing trigger. Even if hashed, this bypasses standard Supabase Auth mechanisms if not handled carefully.
- **Missing**: Proper Supabase Auth registration for care givers.

### 2. Missing Input Validation
- **Files**: [CareGiverProfileDialog.tsx](file:///c:/Users/Lenovo/Desktop/onecaresol/src/components/CareGiverProfileDialog.tsx), [AddCareGiver.tsx](file:///c:/Users/Lenovo/Desktop/onecaresol/src/pages/AddCareGiver.tsx)
- **Issue**: Despite having `zod` and `react-hook-form` in the project, many forms use basic `useState` and manual validation.
- **Risk**: Potential for malformed data to reach the database (e.g., negative salaries, invalid emails not caught by basic regex, missing required fields).

### 3. Tenant Isolation Inconsistency
- **Files**: [use-care-data.ts](file:///c:/Users/Lenovo/Desktop/onecaresol/src/hooks/use-care-data.ts)
- **Issue**: Some hooks (like `useAddCareReceiver`) explicitly fetch and set `company_id`, while others (like `useAddCareGiver`) rely on database defaults.
- **Risk**: If the `current_company_id()` default fails or is not set on all tables, data might be "orphaned" or associated with the wrong company.

---

## 🟡 Medium Priority / Bugs

### 4. Fragile JSON Parsing
- **Files**: [CareGiverProfileDialog.tsx](file:///c:/Users/Lenovo/Desktop/onecaresol/src/components/CareGiverProfileDialog.tsx) (Lines 107, 175)
- **Issue**: `JSON.parse` is called on fields like `hours` and `references`. 
- **Risk**: If the data is already an object (which Supabase often returns for JSONB columns), `JSON.parse` on a non-string will throw an error and crash the component.

### 5. UTC vs. Local Time Confusion
- **Files**: [Index.tsx](file:///c:/Users/Lenovo/Desktop/onecaresol/src/pages/Index.tsx) (Line 27), [CareGivers.tsx](file:///c:/Users/Lenovo/Desktop/onecaresol/src/pages/CareGivers.tsx)
- **Issue**: Use of `.getUTCHours()` and `.getUTCMinutes()` for display.
- **Risk**: Users will see times in UTC, which may be several hours off from their local business time, leading to confusion about shift starts and check-ins.

### 6. Developer "Easter Egg" / Sorting Hack
- **Files**: [CareGivers.tsx](file:///c:/Users/Lenovo/Desktop/onecaresol/src/pages/CareGivers.tsx) (Line 54)
- **Issue**: Hardcoded sorting logic to put any name containing "mamoon" last.
- **Risk**: This is unprofessional and can cause unexpected sorting behavior for real users who happen to have that name.

---

## 🔵 Low Priority / Incomplete Things

### 7. Hardcoded Dashboard Stats
- **Files**: [Index.tsx](file:///c:/Users/Lenovo/Desktop/onecaresol/src/pages/Index.tsx) (Lines 187-197)
- **Issue**: Statistics like "Late Calls", "Missed Calls", and "Overdue Tasks" are hardcoded strings (e.g., `"2"`, `"5"`, `"3"`).
- **Incomplete**: These should be derived from real database queries using aggregate functions.

### 8. Hardcoded Options
- **Files**: [AddCareGiver.tsx](file:///c:/Users/Lenovo/Desktop/onecaresol/src/pages/AddCareGiver.tsx) (Line 74)
- **Issue**: `MANAGER_OPTIONS` is hardcoded as `["Manager 1", "Manager 2", "Manager 3"]`.
- **Incomplete**: Managers should be fetched from the `company_users` or `care_givers` table where the role is appropriate.

### 9. Placeholder Pages
- **Files**: [InvoicingPlaceholder.tsx](file:///c:/Users/Lenovo/Desktop/onecaresol/src/pages/InvoicingPlaceholder.tsx)
- **Issue**: Entire sections of the app (Invoicing, Wages) are behind "Under Construction" placeholders.

### 10. Missing Loading States (Skeletons)
- **Files**: Most pages (e.g., [CareGivers.tsx](file:///c:/Users/Lenovo/Desktop/onecaresol/src/pages/CareGivers.tsx) Line 108)
- **Issue**: Uses simple `Loading...` text.
- **Incomplete**: Should use Framer Motion or Shadcn Skeletons for a more premium feel.

---

## 🛠️ Code Quality Suggestions
- **Type Safety**: Replace `any` casts in [use-care-data.ts](file:///c:/Users/Lenovo/Desktop/onecaresol/src/hooks/use-care-data.ts) with proper TypeScript interfaces (or generated Supabase types).
- **Code Duplication**: `TAG_OPTIONS` and tag styling are duplicated across [CareGivers.tsx](file:///c:/Users/Lenovo/Desktop/onecaresol/src/pages/CareGivers.tsx) and [CareGiverProfileDialog.tsx](file:///c:/Users/Lenovo/Desktop/onecaresol/src/components/CareGiverProfileDialog.tsx). These should be in a shared `constants.ts` or `types.ts`.
- **Accurate Age**: Use `date-fns` for age calculation instead of dividing by milliseconds (accounts for leap years).
</artifacts>
</workspace_context>
<mission_brief>[Describe your task here...]</mission_brief>