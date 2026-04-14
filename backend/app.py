from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import predict_all
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}

def allowed_file(filename):
    """Check if file has allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def home():
    """Health check endpoint."""
    return jsonify({
        "status": "running",
        "message": "Alzheimer Detection API Running 🚀",
        "version": "1.0.0"
    })

@app.route("/predict", methods=["POST"])
def predict():
    """
    Predict Alzheimer's disease stage from uploaded brain scan image.
    
    Expected: multipart/form-data with 'file' field
    Returns: JSON with predictions from all models and ensemble
    """
    # Check if file is present in request
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    
    # Check if file is selected
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    # Check if file type is allowed
    if not allowed_file(file.filename):
        return jsonify({
            "error": f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        }), 400
    
    try:
        # Save file to uploads folder
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        
        # Get predictions from all models
        results = predict_all(filepath)
        
        # Optionally remove file after prediction (uncomment to enable)
        # os.remove(filepath)
        
        return jsonify(results), 200
    
    except Exception as e:
        return jsonify({
            "error": f"Prediction failed: {str(e)}"
        }), 500

@app.route("/health")
def health():
    """Detailed health check with model status."""
    from predict import cnn_model, resnet_model, inception_model
    
    return jsonify({
        "status": "healthy",
        "models": {
            "cnn": "loaded" if cnn_model else "not loaded",
            "resnet": "loaded" if resnet_model else "not loaded",
            "inception": "loaded" if inception_model else "not loaded"
        }
    })

if __name__ == "__main__":
    print("\n" + "="*50)
    print("🧠 Alzheimer Detection API")
    print("="*50)
    print("Starting server at http://127.0.0.1:5000")
    print("Endpoints:")
    print("  GET  /        - Health check")
    print("  GET  /health  - Model status")
    print("  POST /predict - Upload image for prediction")
    print("="*50 + "\n")
    
    app.run(debug=True, host='127.0.0.1', port=5000)
