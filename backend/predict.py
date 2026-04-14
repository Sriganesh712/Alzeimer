import numpy as np
from tensorflow.keras.models import load_model
from keras.preprocessing import image
import os
from tensorflow.keras.layers import Layer
import tensorflow as tf

# Model paths
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
CNN_MODEL_PATH = os.path.join(MODEL_DIR, "cnn.h5")
RESNET_MODEL_PATH = os.path.join(MODEL_DIR, "resnet.keras")
INCEPTION_MODEL_PATH = os.path.join(MODEL_DIR, "inception.keras")



class CustomScaleLayer(Layer):
    def __init__(self, scale=1.0, **kwargs):
        super(CustomScaleLayer, self).__init__(**kwargs)
        self.scale = scale

    def call(self, inputs):
        return inputs * self.scale

    def get_config(self):
        config = super(CustomScaleLayer, self).get_config()
        config.update({
            "scale": self.scale
        })
        return config
print("Loading models...")

# CNN Model - try with compile first, fallback to compile=False
try:
    cnn_model = load_model(CNN_MODEL_PATH)
    print("✓ CNN model loaded")
except Exception as e:
    try:
        print(f"  Retrying CNN model with compile=False...")
        cnn_model = load_model(CNN_MODEL_PATH, compile=False)
        print("✓ CNN model loaded (without compilation)")
    except Exception as e2:
        print(f"✗ Error loading CNN model: {e2}")
        cnn_model = None

# ResNet Model - try with compile first, fallback to compile=False
try:
    resnet_model = load_model(RESNET_MODEL_PATH)
    print("✓ ResNet model loaded")
except Exception as e:
    try:
        print(f"  Retrying ResNet model with compile=False...")
        resnet_model = load_model(RESNET_MODEL_PATH, compile=False)
        print("✓ ResNet model loaded (without compilation)")
    except Exception as e2:
        print(f"✗ Error loading ResNet model: {e2}")
        resnet_model = None

# Inception Model - try multiple loading strategies
try:
    inception_model = load_model(
    INCEPTION_MODEL_PATH,
    custom_objects={"CustomScaleLayer": CustomScaleLayer},
    compile=False
    )
    print("✓ Inception model loaded")
except Exception as e:
    print(f"  Initial load failed, trying compile=False...")
    try:
        # Load without compiling - skips optimizer/metrics deserialization
        inception_model = load_model(
        INCEPTION_MODEL_PATH,
        custom_objects={"CustomScaleLayer": CustomScaleLayer},
        compile=False,
        safe_mode=False
        )
        print("✓ Inception model loaded (without compilation)")
    except Exception as e2:
        print(f"  compile=False failed, trying safe_mode=False...")
        try:
            # Try with safe_mode=False for Keras 3.x compatibility
            inception_model = load_model(INCEPTION_MODEL_PATH, compile=False, safe_mode=False)
            print("✓ Inception model loaded (safe_mode=False)")
        except Exception as e3:
            print(f"✗ Error loading Inception model after all attempts:")
            print(f"  Attempt 1: {str(e)[:100]}...")
            print(f"  Attempt 2: {str(e2)[:100]}...")
            print(f"  Attempt 3: {str(e3)[:100]}...")
            inception_model = None

# Class labels for predictions
class_labels = ['MildDemented', 'ModerateDemented', 'NonDemented', 'VeryMildDemented']

# Note: Models loaded with compile=False will still work for predictions
# but won't include optimizer state. This is fine for inference.
# If you need to continue training, you'll need to recompile with:
# model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

def preprocess(img_path, size):
    """
    Preprocess image for model prediction.
    
    Args:
        img_path: Path to the image file
        size: Target size tuple (width, height)
    
    Returns:
        Preprocessed image array normalized to [0, 1]
    """
    img = image.load_img(img_path, target_size=size)
    img = image.img_to_array(img) / 255.0
    return np.expand_dims(img, axis=0)

def get_result(pred):
    """
    Convert model prediction to readable result.
    
    Args:
        pred: Model prediction array
    
    Returns:
        Dictionary with label, confidence, and all probabilities
    """
    probabilities = {class_labels[i]: float(pred[0][i]) for i in range(len(class_labels))}
    
    # Sort probabilities by value descending
    sorted_probs = dict(sorted(probabilities.items(), key=lambda item: item[1], reverse=True))
    
    return {
        "label": class_labels[np.argmax(pred)],
        "confidence": float(np.max(pred)),
        "probabilities": sorted_probs
    }

def predict_all(img_path):
    """
    Run prediction with all three models and return ensemble result.
    
    Args:
        img_path: Path to the uploaded image
    
    Returns:
        Dictionary containing predictions from all models and ensemble
    """
    results = {}
    predictions = {}
    
    # CNN prediction (176x176)
    if cnn_model:
        try:
            cnn_pred = cnn_model.predict(preprocess(img_path, (176, 176)), verbose=0)
            results["cnn"] = get_result(cnn_pred)
            predictions["cnn"] = cnn_pred
        except Exception as e:
            results["cnn"] = {"error": f"CNN prediction failed: {str(e)[:100]}"}
    else:
        results["cnn"] = {"error": "CNN model not loaded"}
    
    # ResNet prediction (224x224)
    if resnet_model:
        try:
            resnet_pred = resnet_model.predict(preprocess(img_path, (224, 224)), verbose=0)
            results["resnet"] = get_result(resnet_pred)
            predictions["resnet"] = resnet_pred
        except Exception as e:
            results["resnet"] = {"error": f"ResNet prediction failed: {str(e)[:100]}"}
    else:
        results["resnet"] = {"error": "ResNet model not loaded"}
    
    # Inception prediction (299x299)
    if inception_model:
        try:
            inception_pred = inception_model.predict(preprocess(img_path, (299, 299)), verbose=0)
            results["inception"] = get_result(inception_pred)
            predictions["inception"] = inception_pred
        except Exception as e:
            results["inception"] = {"error": f"Inception prediction failed: {str(e)[:100]}"}
    else:
        results["inception"] = {"error": "Inception model not loaded - check backend logs for details"}
    
    # Ensemble prediction (weighted average)
    if all(key in predictions for key in ["cnn", "resnet", "inception"]):
        try:
            ensemble_pred = (0.4 * predictions["cnn"] + 
                           0.3 * predictions["inception"] + 
                           0.3 * predictions["resnet"])
            results["ensemble"] = get_result(ensemble_pred)
        except Exception as e:
            results["ensemble"] = {"error": f"Ensemble calculation failed: {str(e)[:100]}"}
    else:
        # Provide helpful message about which models are missing
        missing = [m for m in ["cnn", "resnet", "inception"] if m not in predictions]
        results["ensemble"] = {
            "error": f"Cannot create ensemble - missing predictions from: {', '.join(missing)}"
        }
    
    return results
