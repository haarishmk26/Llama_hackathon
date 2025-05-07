# LLAMA_HACKATHON

A project for analyzing UI changes and user feedback using the Llama API.

#Demo


[![Watch the video](https://img.youtube.com/vi/JBJghpx4xJk/0.jpg)](https://www.youtube.com/watch?v=JBJghpx4xJk)


---

## Project Structure

```
LLAMA_HACKATHON/
├── assets/
├── Dashboard new/
├── Dashboard_old/
├── Frontend/
├── llama-backend/           # Python virtual environment for backend
├── app.py                   # Flask backend application
├── Code.py
├── Product roadmap.md
├── User Feedback Entries.csv
├── README.md                # <--- This file
```

---

## Prerequisites

- **Node.js** (v18.0.0 or later)
- **npm** (v8.0.0 or later) or **yarn** (v1.22.0 or later)
- **Python 3** (for backend)
- **pip** (for backend dependencies)
- **Git** (for version control)

---

## Frontend Setup

1. **Install dependencies:**

   ```bash
   cd Frontend
   npm install
   # or
   yarn install
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open your browser at:** [http://localhost:3000](http://localhost:3000)

---

## Backend Setup

1. **Create and activate the virtual environment:**

   ```bash
   python3 -m venv llama-backend
   source llama-backend/bin/activate
   ```

2. **Install dependencies:**

   ```bash
   pip install Flask requests python-dotenv
   ```

3. **Create a `.env` file** in the root with:

   ```
   FLASK_APP=app.py
   FLASK_ENV=development
   LLAMA_API_KEY=LLM|1671322013583157|rLNuBsns7aO149BRL62uO5OLcIk
   LLAMA_API_ENDPOINT=https://api.llama.example.com/v1/analyze
   ```

4. **Run the backend:**
   ```bash
   flask run
   # or
   python app.py
   ```

---

## Key Dependencies

- **Frontend:**

  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - Lucide React

- **Backend:**
  - Flask
  - requests
  - python-dotenv

---

## Environment Variables

- **Frontend:**  
  Create a `.env.local` in the `Frontend` directory if needed:

  ```
  NEXT_PUBLIC_API_URL=http://localhost:3000/api
  ```

- **Backend:**  
  See `.env` example above.

---

## Troubleshooting

- **Dependencies not installing:**  
  Delete `node_modules` and `package-lock.json`, then run `npm install` again.

- **TypeScript build errors:**  
  Run `npm run lint` in the frontend.

- **Backend environment issues:**  
  Ensure your virtual environment is activated and `.env` is present.

---

## Support

If you encounter issues, open an issue on the GitHub repository or contact the development team.

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Meta Llama API Overview](https://llama.developer.meta.com/docs/overview/?team_id=1716420322281298)
