import React, { useEffect, useState } from "react";
import '@tensorflow/tfjs';
import * as cocoSsd  from "@tensorflow-models/coco-ssd"

const ObjectDetection = () => {

    const [model, setModel] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [canvasSize, setCanvasSize] = useState({width: 0, height: 0});
    const [predictedValues, setPredictedValues] = useState("");

    useEffect(() => {
        const loadModel = async () => {
            const loadedModel = await cocoSsd.load();
            setModel(loadedModel);
        };
        loadModel();
        // [] = empty dependencies is used so that the model only loads once after initial render
        // you can technically reload when it is triggered again
        // but once model is loaded, there should be nothing else to load
        // hence, we use [].
    }, []);

    const handleImageUpload = async (event) => {
        const file = event.target.file[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    setImageSrc(img.src);
                    setCanvasSize({ width: img.width, height: img.height,});
                    // check if model has loaded (it should've, but never a bad thing to check)
                    if (model) {
                        predictImage(img);
                    } else {
                        console.error("Model has not loaded yet...");
                    }
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const predictImage = async (img) => {
        if (model) {
            // using tensorflow to detect the image
            // await means wait for variable to be set
            const predictions = await model.detect(img);
            setPredictedValues(predictions);
        }
    }


    return (
        <div>
            <h1>Object Detection Component</h1>
            {/* whenever the image is changed, rerun the model */}
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <div>
                {imageSrc && (
                    <div>
                        <h3>Uploaded Image</h3>
                            <img src={imageSrc} alt="Upload Preview" />
                    </div>
                )}
            </div>
            {/* If the predictedValues array has elements, then for each prediction, give the score */}
            {predictedValues.length > 0 && (
                <div>
                    <h3>Predictions</h3>
                    {/* This is effectively a loop */}
                    {predictedValues.map((eachPrediction, index) => (
                        // .score shows us how confident the model is for a prediction
                        <p key={index}>{eachPrediction.score}</p>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ObjectDetection;