# 🧠 Artifact – MVP Summary and Technical Structure

**Artifact** is a strategic tool that helps product teams understand how their product UI and functionality evolved across versions, why those changes occurred, and how they impacted users — all without needing traditional A/B testing.

---

## ✅ MVP Features

### 1. Project Creation Flow

- User clicks “New Project”
- Uploads:
  - Screenshots of UI before (v1) and after (v2)
  - Optional supporting doc (CSV/Notion/text file with user feedback or changelogs)

### 2. Analysis Pipeline

- Compares before/after screenshots using LLM vision
- Parses uploaded feedback to extract pain points and suggestions
- Synthesizes a report showing:
  - Key UI/UX changes
  - Feedback that was addressed or missed
  - Strategic summary of what likely improved

### 3. Presentation

- Tabs: Summary | UI Changes | Feedback
- Displays visual and textual comparison + insights

---

## 🧱 Technical Sections

### 📁 1. `app/` – Page Routing and Layout

#### `/projects/new`

- Multi-step upload form for screenshots and feedback
- Button: “Generate Insights”

#### `/projects/[id]`

- View project insights
  - Tab 1: Summary
  - Tab 2: UI Changes
  - Tab 3: Feedback

---

### 🧩 2. `components/` – UI Components

- `ImageUpload.tsx`
- `ProjectCard.tsx`
- `InsightSection.tsx`
- `FeedbackList.tsx`
- `ImageDiffViewer.tsx`

---

### 🔌 3. `api/` – Backend Logic

#### `/api/analyze`

- Accepts uploads from form
- Calls LLM to process:
  - UI change detection
  - Feedback correlation
  - Insight synthesis
- Returns:
  - `summary`, `uiChanges`, `feedbackInsights`

---

### 💾 4. `lib/` or `utils/` – Helper Functions

- `parseFeedback.ts`: Parse CSV or text feedback
- `formatPrompt.ts`: Construct LLM prompt
- `callLlamaAPI.ts`: Handle LLM API request

---

### 📊 5. `types/` – Data Models

```ts
type Project = {
  id: string;
  title: string;
  screenshots: { before: string; after: string };
  feedbackDoc?: string;
  summary: string;
  uiChanges: string[];
  feedbackInsights: string[];
};
```

---

## ⏭️ Next Development Sections

1. Implement `/projects/new` form UI and file upload logic
2. Create backend `/api/analyze` route to process files
3. Write `analyzeUI()` and `analyzeFeedback()` functions
4. Connect API response to `/projects/[id]` view
5. Build tabbed view with summary, UI changes, and feedback insights
6. Add storage (local or cloud) to persist uploaded projects
7. Optionally, add export/share functionality
