from flask import Flask, request, jsonify, send_from_directory
from deepface import DeepFace
import os
import tempfile
from werkzeug.utils import secure_filename
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended.exceptions import NoAuthorizationError
from pymongo import MongoClient
from datetime import datetime
from flask_cors import CORS
from bson import ObjectId
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)

# --- LOAD ENV VARIABLES ---
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

# --- APP INIT ---
app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
bcrypt = Bcrypt(app)

# --- CONFIG ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FACES_DIR = os.path.join(BASE_DIR, "face_recognition", "faces_db")
os.makedirs(FACES_DIR, exist_ok=True)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "crimai")

app.config["JWT_SECRET_KEY"] = "karsh_secret_key"
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"
jwt = JWTManager(app)

# --- MONGODB CONNECTION ---
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client[MONGO_DB_NAME]
    criminals_col = db["criminals"]
    detections_col = db["detections"]
    users_col = db["users"]
    print("✅ MongoDB connected successfully")
except Exception as e:
    print("⚠️ MongoDB not connected:", e)
    client = db = criminals_col = detections_col = users_col = None


# -------------------- HOME --------------------
@app.route("/")
def home():
    return jsonify({"message": "🚀 CrimAI Backend Running Successfully"}), 200


# -------------------- USER AUTH --------------------
@app.route("/api/auth/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        phone = data.get("phone")
        role = data.get("role", "user")  # default user

        if not all([name, email, password]):
            return jsonify({"message": "Missing required fields"}), 400

        if users_col.find_one({"email": email}):
            return jsonify({"message": "User already exists"}), 400

        hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")

        users_col.insert_one({
            "name": name,
            "email": email,
            "password": hashed_pw,
            "phone": phone or "",
            "role": role,
            "joinDate": datetime.utcnow()
        })

        return jsonify({"message": "Signup successful ✅"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/auth/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        user = users_col.find_one({"email": email})
        if not user:
            return jsonify({"message": "User not found"}), 404

        if not bcrypt.check_password_hash(user["password"], password):
            return jsonify({"message": "Invalid credentials"}), 401

        token = create_access_token(identity=str(user["_id"]))

        user_data = {
            "name": user["name"],
            "email": user["email"],
            "phone": user.get("phone", ""),
            "role": user.get("role", "user"),
            "joinDate": user.get("joinDate")
        }

        return jsonify({
            "token": token,
            "user": user_data,
            "message": "Login successful ✅"
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------- USER PROFILE --------------------
@app.route("/api/users", methods=["GET"])
@jwt_required()
def get_user():
    try:
        user_id = get_jwt_identity()
        if not ObjectId.is_valid(user_id):
            return jsonify({"message": "Invalid token or user"}), 401

        user = users_col.find_one({"_id": ObjectId(user_id)}, {"password": 0})
        if not user:
            return jsonify({"message": "User not found"}), 404

        user["_id"] = str(user["_id"])
        if isinstance(user.get("joinDate"), datetime):
            user["joinDate"] = user["joinDate"].strftime("%Y-%m-%d %H:%M:%S")

        return jsonify(user), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/users/update", methods=["PUT"])
@jwt_required()
def update_user():
    try:
        user_id = get_jwt_identity()
        if not ObjectId.is_valid(user_id):
            return jsonify({"message": "Invalid token"}), 401

        data = request.get_json()
        update_fields = {k: v for k, v in data.items() if k in ["name", "phone"]}

        if not update_fields:
            return jsonify({"message": "No fields to update"}), 400

        users_col.update_one({"_id": ObjectId(user_id)}, {"$set": update_fields})
        updated_user = users_col.find_one({"_id": ObjectId(user_id)}, {"password": 0})

        updated_user["_id"] = str(updated_user["_id"])
        return jsonify({
            "message": "Profile updated successfully ✅",
            "updated_user": updated_user
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------- ADMIN DASHBOARD ROUTES --------------------
def check_admin():
    """Helper: Verify current user is admin"""
    try:
        current_user_id = get_jwt_identity()
        if not ObjectId.is_valid(current_user_id):
            return False
        user = users_col.find_one({"_id": ObjectId(current_user_id)})
        return bool(user and user.get("role") == "admin")
    except Exception as e:
        print("check_admin error:", e)
        return False


@app.route('/api/admin/users', methods=['GET'])
@jwt_required()
def get_all_users():
    try:
        if not check_admin():
            return jsonify({"error": "Access denied ❌"}), 403

        users = list(users_col.find({}, {"password": 0}))
        for u in users:
            u["_id"] = str(u["_id"])
        return jsonify(users), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/admin/detections', methods=['GET'])
@jwt_required()
def get_all_detections():
    try:
        if not check_admin():
            return jsonify({"error": "Access denied ❌"}), 403

        detections = list(detections_col.find({}))
        for d in detections:
            d["_id"] = str(d["_id"])
            if isinstance(d.get("detected_at"), datetime):
                d["detected_at"] = d["detected_at"].strftime("%Y-%m-%d %H:%M:%S")
        return jsonify(detections), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/admin/delete_user/<user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    try:
        if not check_admin():
            return jsonify({"error": "Access denied ❌"}), 403

        users_col.delete_one({"_id": ObjectId(user_id)})
        return jsonify({"message": "User deleted successfully ✅"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/admin/delete_detection/<det_id>', methods=['DELETE'])
@jwt_required()
def delete_detection(det_id):
    try:
        if not check_admin():
            return jsonify({"error": "Access denied ❌"}), 403

        detections_col.delete_one({"_id": ObjectId(det_id)})
        return jsonify({"message": "Detection deleted successfully ✅"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# -------------------- ADD CRIMINAL --------------------
@app.route("/add_criminal", methods=["POST"])
def add_criminal():
    try:
        data = request.form
        image = request.files.get("image")

        if not data.get("name") or not image:
            return jsonify({"error": "Name and image are required"}), 400

        safe_name = secure_filename(data["name"].replace(" ", "_"))
        ext = os.path.splitext(image.filename)[1] or ".jpg"
        filename = f"{safe_name}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}{ext}"
        save_path = os.path.join(FACES_DIR, filename)
        image.save(save_path)

        doc = {
            "name": data.get("name"),
            "age": data.get("age"),
            "father_name": data.get("father_name"),
            "gender": data.get("gender"),
            "blood_group": data.get("blood_group"),
            "address": data.get("address"),
            "crime": data.get("crime"),
            "details": data.get("details"),
            "image_filename": filename,
            "image_path": f"/faces_db/{filename}",
            "created_at": datetime.utcnow(),
        }

        criminals_col.insert_one(doc)
        return jsonify({"message": f"✅ Criminal {data['name']} added successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------- MATCH CRIMINAL --------------------
def match_criminal(temp_path, source_type="image"):
    if criminals_col is None or detections_col is None:
        return None, None

    for fname in os.listdir(FACES_DIR):
        if not fname.lower().endswith((".jpg", ".jpeg", ".png")):
            continue

        db_path = os.path.join(FACES_DIR, fname)
        try:
            v = DeepFace.verify(
                img1_path=temp_path,
                img2_path=db_path,
                model_name="VGG-Face",
                enforce_detection=False,
            )
            if v.get("verified"):
                matched_criminal = criminals_col.find_one({"image_filename": fname}, {"_id": 0})
                if matched_criminal:
                    detections_col.insert_one({
                        "criminal_name": matched_criminal["name"],
                        "criminal_details": matched_criminal,
                        "detected_at": datetime.utcnow(),
                        "source": source_type,
                        "status": "Detected",
                    })
                return fname, matched_criminal
        except Exception:
            continue
    return None, None


# -------------------- RECOGNIZE IMAGE --------------------
@app.route("/recognize", methods=["POST"])
def recognize():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image provided"}), 400

        image = request.files["image"]
        temp_path = os.path.join(tempfile.mkdtemp(), secure_filename(image.filename))
        image.save(temp_path)

        matched_file, matched_criminal = match_criminal(temp_path, "image")
        os.remove(temp_path)

        if matched_file:
            return jsonify({
                "match": True,
                "matched_filename": matched_file,
                "image_url": f"/faces_db/{matched_file}",
                "message": f"⚠️ Criminal Found: {matched_criminal.get('name', 'Unknown')}",
                "criminal_details": matched_criminal
            }), 200
        else:
            return jsonify({"match": False, "message": "✅ No match found"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------- DETECTIONS (LOGS PAGE) --------------------
@app.route("/api/detections", methods=["GET"])
def get_detections():
    try:
        detections = list(detections_col.find({}, {"_id": 0}).sort("detected_at", -1))
        for d in detections:
            if isinstance(d.get("detected_at"), datetime):
                d["detected_at"] = d["detected_at"].strftime("%Y-%m-%d %H:%M:%S")

        return jsonify(detections), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------- SERVE FACES --------------------
@app.route("/faces_db/<filename>")
def serve_face(filename):
    return send_from_directory(FACES_DIR, filename)


# -------------------- JWT ERROR HANDLERS --------------------
@jwt.unauthorized_loader
def unauthorized_callback(callback):
    return jsonify({"message": "Missing or invalid token"}), 401


@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({"message": "Invalid token format"}), 422


@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({"message": "Token expired"}), 401


# -------------------- RUN APP --------------------
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
