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
                }
            }
        }
    }

    return (
        <div>
            <ObjectDetection />
        </div>
    )
}

export default ObjectDetection;