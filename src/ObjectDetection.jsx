import React, { useEffect, useState } from "react";
import '@tensorflow/tfjs';
import * as cocoSsd  from "@tensorflow-models/coco-ssd"

const ObjectDetection = () => {

    const [model, setModel] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);

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
    }, [])

    return (
        <div>
            <ObjectDetection />
        </div>
    )
}

export default ObjectDetection;