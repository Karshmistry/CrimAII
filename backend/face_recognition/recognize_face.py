from flask import Flask, request, jsonify
from deepface import DeepFace
import os

app = Flask(__name__)

# Folder jaha database images store karenge
DATABASE_DIR = "faces_db"
os.makedirs(DATABASE_DIR, exist_ok=True)

@app.route("/")
def home():
    return jsonify({"message": "Face Recognition API running ✅"})

@app.route("/recognize", methods=["POST"])
def recognize_face():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        img = request.files["image"]
        img_path = "temp.jpg"
        img.save(img_path)

        # Compare with all images in database folder
        for file in os.listdir(DATABASE_DIR):
            db_path = os.path.join(DATABASE_DIR, file)
            result = DeepFace.verify(img_path, db_path, model_name="VGG-Face", enforce_detection=False)
            
            if result["verified"]:
                return jsonify({
                    "match": True,
                    "criminal_name": file.split(".")[0],
                    "message": f"⚠️ Criminal Found: {file}"
                })

        return jsonify({"match": False, "message": "✅ No criminal match found"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5001, debug=True)
