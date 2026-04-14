from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from predict import predict_all, cnn_model, resnet_model, inception_model
from PIL import Image
import io

app = FastAPI(title="Alzheimer Detection API", version="2.0.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}


def allowed_file(filename: str):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.get("/")
def home():
    return {
        "status": "running",
        "message": "Alzheimer Detection API Running 🚀",
        "version": "2.0.0"
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    
    if not allowed_file(file.filename):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    try:
        contents = await file.read()

        image = Image.open(io.BytesIO(contents)).convert("RGB")

        results = predict_all(image)

        return results

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "models": {
            "cnn": "loaded" if cnn_model else "not loaded",
            "resnet": "loaded" if resnet_model else "not loaded",
            "inception": "loaded" if inception_model else "not loaded"
        }
    }