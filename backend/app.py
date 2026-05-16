from flask import Flask, request, jsonify, render_template, session
from flask_cors import CORS
import hashlib, os

app = Flask(__name__, template_folder="templates")
app.secret_key = os.urandom(24)   # session signing key
CORS(app, supports_credentials=True)

# ── In-memory user store  { email: hashed_password } ──────────────────────
USERS: dict[str, str] = {}


def _hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


# ── Serve the single-page app ──────────────────────────────────────────────
@app.get("/")
def index():
    return render_template("index.html")


# ── Auth API ───────────────────────────────────────────────────────────────
@app.post("/api/signup")
def signup():
    data = request.get_json(silent=True) or {}
    name     = (data.get("name") or "").strip()
    email    = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name or not email or not password:
        return jsonify({"ok": False, "message": "All fields are required."}), 400
    if len(password) < 6:
        return jsonify({"ok": False, "message": "Password must be at least 6 characters."}), 400
    if email in USERS:
        return jsonify({"ok": False, "message": "An account with this email already exists."}), 409

    USERS[email] = _hash(password)
    return jsonify({"ok": True, "message": "Account created! Please sign in."}), 201


@app.post("/api/login")
def login():
    data = request.get_json(silent=True) or {}
    email    = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"ok": False, "message": "Email and password are required."}), 400

    stored = USERS.get(email)
    if stored is None or stored != _hash(password):
        return jsonify({"ok": False, "message": "Invalid email or password."}), 401

    session["user"] = email
    return jsonify({"ok": True, "message": "Welcome back!", "email": email})


@app.post("/api/logout")
def logout():
    session.clear()
    return jsonify({"ok": True, "message": "Logged out."})


@app.get("/api/me")
def me():
    user = session.get("user")
    if user:
        return jsonify({"ok": True, "email": user})
    return jsonify({"ok": False}), 401


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
