import React, { useEffect, useState } from "react";
import '@tensorflow/tfjs';
import * as cocoSsd  from "@tensorflow-models/coco-ssd"
import "./ObjectDetection.css";

const ObjectDetection = () => {

    const [model, setModel] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [canvasSize, setCanvasSize] = useState({width: 0, height: 0});
    const [predictedValues, setPredictedValues] = useState([]);

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
        const file = event.target.files[0];
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
    };

    // Draw a bounding box around the image that the model predicts
    const drawPredictions = (ctx, predictions) => {
        predictions.forEach((prediction) => {
            // prediction.bbox: tensorflow gives the data for the bounding box 
            // if we do console.log({x, y, width, height}), we'll be able to see the data
            const [x, y, width, height] = prediction.bbox;
            // set the bounding box line color and width
            ctx.strokeStyle = "red";
            ctx.lineWidth = 4;
            // define the shape of the box drawing
            ctx.strokeRect(x, y, width, height);
            ctx.font = "20px Arial";
            ctx.fillStyle = "red";
            ctx.fillText(
                `${prediction.class}: ${Math.round(prediction.score * 100)}%`, 
                x, 
                y > 10 ? y - 5 : 10,
            );
            });
    };


    return (
        <div className="ObjectDetection">
            <h1>Object Detection Component</h1>
            {/* whenever the image is changed, rerun the model */}
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <div className="images-container">
                {imageSrc && (
                    <div className="image-wrapper">
                        <h3>Uploaded Image</h3>
                            <img src={imageSrc} alt="Upload Preview" className="uploaded-image"/>
                    </div>
                )}
                {imageSrc && (
                    <div className="image-wrapper">
                        <h3>Predicted Image</h3>
                        <canvas 
                            width={canvasSize.width}
                            height={canvasSize.height}
                            className="predicted-canvas"
                            ref={(canvasRef) => {
                                // if there's a canvas and there are predicted values, call drawPredictions, with 2d context
                                if (canvasRef && predictedValues.length > 0) {
                                    const ctx = canvasRef.getContext("2d");
                                    const canvasImg = new Image();
                                    // imageSrc is the one in the useState
                                    // the image in the canvas will the same one as the one user uploads
                                        canvasImg.src = imageSrc;
                                        canvasImg.onload = () => {
                                            // clear the canvas if new image is uploaded
                                            ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
                                            ctx.drawImage(canvasImg, 0, 0);
                                            drawPredictions(ctx, predictedValues);
                                        }
                                }
                            }}
                        />
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
                        <p key={index} style={{
                            fontSize: "2rem",
                            fontFamily: "monospace",
                        }}>
                            {eachPrediction.class}: {Math.round(eachPrediction.score * 100)}%
                        </p>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ObjectDetection;