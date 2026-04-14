from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import predict_all, cnn_model, resnet_model, inception_model
import os
import uuid
from werkzeug.utils import secure_filename
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/")
def home():
    return jsonify({
        "status": "running",
        "message": "Alzheimer Detection API Running 🚀",
        "version": "2.0.0"
    })


@app.route("/predict", methods=["POST"])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({
            "error": f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        }), 400

    try:
        filename = secure_filename(file.filename)

        # 🔥 Read image directly into memory (NO DISK)
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        results = predict_all(image)

        return jsonify(results), 200

    except Exception as e:
        return jsonify({
            "error": f"Prediction failed: {str(e)}"
        }), 500


@app.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "models": {
            "cnn": "loaded" if cnn_model else "not loaded",
            "resnet": "loaded" if resnet_model else "not loaded",
            "inception": "loaded" if inception_model else "not loaded"
        }
    })