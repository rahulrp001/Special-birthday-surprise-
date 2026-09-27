# Her Birthday Surprise 💗

A private, interactive birthday-surprise website: a **React** frontend and a **Django + Django REST Framework** backend. Nothing personal (her name, birthday, messages, photos) is hardcoded in the frontend — it all lives in the database and is edited through the Django Admin panel.

---

## 📍 Where to customize everything (read this first)

You almost never need to touch code. Start the backend (see setup below), go to **http://127.0.0.1:8000/admin/**, log in with the superuser you create, and:

| What you want to change | Where in the admin |
|---|---|
| 1. Her name | **Birthday Surprise → Birthday Person → name** |
| 2. Date of birth (used for login + countdown) | **Birthday Person → date_of_birth** |
| 3. The birthday message (Page 4, the letter) | **Birthday Person → birthday_message** (one paragraph per line) |
| 4. The final message (Page 9, inside the envelope) | **Birthday Person → final_message** |
| 5. Photos / memories | **Birthday Surprise → Memories → Add Memory** |
| 6. "Why you're special" cards | **Birthday Surprise → Reasons → Add Reason** |
| 7. Profile photo | **Birthday Person → profile_image** |
| 8. Background music | **Birthday Person → background_music** (an mp3 file; leave empty for no music) |

Only one **Birthday Person** row should exist — the admin won't let you add a second one.

---

## 🧱 Tech stack

- **Frontend:** React 18 + Vite, plain JavaScript, custom CSS (no UI framework)
- **Backend:** Python + Django 5 + Django REST Framework
- **Database:** SQLite for development (swap the `DATABASES` dict in `settings.py` for PostgreSQL later)
- **Communication:** JSON REST API over `axios`, CORS configured with `django-cors-headers`

---

## 📁 Folder structure

```
birthday-surprise/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── birthday_project/         # Django project (settings/urls/wsgi/asgi)
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── birthday/                 # Django app
│       ├── models.py             # BirthdayPerson, Memory, Reason
│       ├── admin.py
│       ├── serializers.py
│       ├── views.py              # /api/... endpoints
│       ├── urls.py
│       ├── migrations/0001_initial.py
│       └── fixtures/sample_reasons.json   # optional starter data
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── pages/Home.jsx        # orchestrates the whole flow
        ├── services/api.js       # the ONLY file with API URLs
        ├── styles/               # variables.css, global.css, animations.css
        └── components/
            ├── Login.jsx / .css
            ├── Welcome.jsx / .css
            ├── BirthdayHero.jsx / .css
            ├── BirthdayMessage.jsx / .css
            ├── MemoryGallery.jsx / .css
            ├── SpecialReasons.jsx / .css
            ├── LoveSurprise.jsx / .css
            ├── BirthdayCountdown.jsx / .css
            ├── FinalSurprise.jsx / .css
            ├── Navbar.jsx / .css        (music control)
            ├── HeartAnimation.jsx / .css
            ├── Confetti.jsx / .css
            ├── Starfield.jsx / .css
            ├── LoadingScreen.jsx / .css
            └── useTypewriter.js         (typing-effect hook)
```

---

## ⚙️ Backend setup (Windows PowerShell)

Open PowerShell in the `backend` folder.

```powershell
# 1. Create and activate a virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create your local environment file
Copy-Item .env.example .env
# Open .env and set DJANGO_SECRET_KEY to any long random string

# 4. Apply database migrations
python manage.py migrate

# 5. Create your admin login
python manage.py createsuperuser

# 6. (Optional) load a few starter "Why you're special" cards
python manage.py loaddata birthday/fixtures/sample_reasons.json

# 7. Run the backend server
python manage.py runserver
```

The API is now live at **http://127.0.0.1:8000/api/** and the admin panel at **http://127.0.0.1:8000/admin/**.

➡️ **Now log into the admin and fill in her name, date of birth, and messages** (see the table above) before testing login on the site.

---

## ⚙️ Frontend setup (Windows PowerShell)

Open a **second** PowerShell window in the `frontend` folder (keep the backend running in the first one).

```powershell
# 1. Install dependencies
npm install

# 2. Create your local environment file
Copy-Item .env.example .env
# The default value already points at the backend above — no edit needed
# unless you change the backend's port.

# 3. Run the frontend dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔌 How the frontend talks to the backend

- Frontend dev server: `http://localhost:5173`
- Backend API: `http://127.0.0.1:8000`
- CORS is configured in `backend/birthday_project/settings.py` via `CORS_ALLOWED_ORIGINS`, read from `.env`.
- Every API call in the frontend goes through **one file**: `frontend/src/services/api.js`. If you ever change the backend's URL or port, that's the only place to update it (`VITE_API_BASE_URL` in `frontend/.env`).

### API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/login/` | Validates name + date of birth |
| GET | `/api/birthday/` | Name, messages, profile photo, music |
| GET | `/api/memories/` | Photo gallery items |
| GET | `/api/reasons/` | "Why you're special" cards |
| GET | `/api/messages/` | Just the two written messages |
| GET | `/api/countdown/` | Next birthday date, computed server-side |

`POST /api/login/` example:

```json
// Request
{ "username": "Ananya", "date_of_birth": "2000-05-14" }

// Response (success)
{ "success": true, "message": "Welcome, Ananya!", "name": "Ananya" }

// Response (failure) — never says which field was wrong
{ "success": false, "message": "Oops! This little surprise is only for you ❤️" }
```

---

## 🧪 Testing instructions

1. Start the backend (`python manage.py runserver`) and the frontend (`npm run dev`).
2. In the admin panel, make sure a **Birthday Person** row exists with the correct name and date of birth.
3. Visit `http://localhost:5173`. You should see the romantic login screen with floating hearts and stars.
4. Try an **incorrect** name or date first — confirm you see "Oops! This little surprise is only for you ❤️" and that the field that was wrong is never revealed.
5. Try the **correct** name and date of birth — confirm the loading animation plays, then the Welcome page's typing effect runs, and you can click through all nine pages to the Final Surprise.
6. Add 2–3 rows to **Memories** and **Reasons** in the admin, refresh, and confirm they appear in the gallery and cards sections.
7. Resize your browser (or use dev tools' device toolbar) to confirm nothing scrolls horizontally on mobile widths.
8. If you added a `background_music` file, confirm the 🎵 button in the top-right toggles playback.

---

## 🛠️ Common errors and solutions

**"Network Error" / "Can't reach the server" on the login page**
→ The backend isn't running, or it's on a different port than `frontend/.env` expects. Start it with `python manage.py runserver` and confirm `VITE_API_BASE_URL` in `frontend/.env` matches.

**CORS error in the browser console (`blocked by CORS policy`)**
→ Check `CORS_ALLOWED_ORIGINS` in `backend/.env` includes `http://localhost:5173`, then restart `python manage.py runserver`.

**Login always fails even with the right details**
→ Make sure a `BirthdayPerson` row actually exists in the admin, and that the date of birth format matches. The date-of-birth `<input type="date">` sends `YYYY-MM-DD`, matching what Django expects.

**`ModuleNotFoundError: No module named 'django'`**
→ Your virtual environment isn't activated. Run `.\venv\Scripts\Activate.ps1` again, then re-run `pip install -r requirements.txt`.

**`npm error 403` or similar during `npm install`**
→ You're offline or behind a proxy/firewall blocking the npm registry. Retry on a normal internet connection.

**Photos don't show up after adding a Memory**
→ Confirm `MEDIA_URL`/`MEDIA_ROOT` are being served — this only happens automatically while `DEBUG=True` (the default for development).

**"Oops!" shows even though you're sure the details are right**
→ Remember the admin's `name` field is compared case-insensitively but must otherwise match exactly (no extra spaces) — check for typos in either the admin record or what's typed on the login page.

**Port already in use**
→ Another process is using 8000 or 5173. Stop it, or run `python manage.py runserver 8001` / `npm run dev -- --port 5174` and update the corresponding `.env` file to match.

---

## 🔒 Notes on security & data

- The date of birth is never sent to or stored in the frontend/JavaScript — it lives only in the Django database and is checked server-side.
- `.env` files (both backend and frontend) are excluded via `.gitignore` — never commit your real secret key or personal data to version control.
- `DJANGO_DEBUG` should be set to `False` before deploying this anywhere public, and `DJANGO_ALLOWED_HOSTS` / `CORS_ALLOWED_ORIGINS` updated to match your real domain.
