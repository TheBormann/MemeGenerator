import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

import { base64toBlob, extractFirstFrameFromVideo } from '../utils/imageUtils';

// Import of all the different upload methods
import UploadFile from "../components/upload-methods/UploadFile";
import ImageURLUpload from "../components/upload-methods/ImageURLUpload";
import CameraImage from "../components/upload-methods/CameraImage";
import HandDrawnImage from "../components/upload-methods/HandDrawnImage";
import BaseLayout from "../components/layout/BaseLayout";
import ApiController from "../data/ApiController";

const AddMethodEditor = () => {
    const [selectedMethod, setSelectedMethod] = useState("fileUpload");
    const [currentDisplayedPicture, setCurrentDisplayedPicture] = useState(null);

    const [uploadedFile, setFile] = useState(null);
    const [urlImageFile, setUrlImageFile] = useState(null);
    const [cameraFile, setCameraFile] = useState(null);
    const [screenShotFile, setScreenShotFile] = useState(null);
    const [gifFile, setGifFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); // Navigate back in history
    };

    const handleFileUpload = (event) => {
        UploadFile.handleFileUpload(event, setCurrentDisplayedPicture, setFile);
    };

    const handleImageURLUpload = (event) => {
        ImageURLUpload.handleImageURLUpload(
            event,
            setCurrentDisplayedPicture,
            setUrlImageFile
        );
    };

    const handleCameraImage = async () => {
        await CameraImage.handleCameraImage(
            setCameraFile,
            setCurrentDisplayedPicture
        );
    };

    const [loadedTemplates, setloadedTemplates] = useState(null);
    let imageURL = null; //"https://api.imgflip.com/get_memes";
    const handleButtonClickThirdPartyURL = async () => {
        const url = imageURL;
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data.data.memes);
            setloadedTemplates(data.data.memes);
        } catch (error) {
            console.log(error);
        }
    };

    const handleThirdPartyImage = (event) => {
        imageURL = event.target.value;
    };

    // Used for hand-drawn images
    const [lines, setLines] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const stageRef = useRef();
    const handleHandDrawnImage = () =>
        HandDrawnImage.HandDrawnImage(
            setIsDrawing,
            setLines,
            lines,
            isDrawing,
            stageRef,
            setCurrentDisplayedPicture,
            saveDataIntoDatabase
        );

    const handleThirdPartyPictureClick = (url, name) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;

        img.onload = async () => {
            fetchThirdPartyImage(img.src)
                .then(customFile => {
                    if (customFile) {
                        ApiController.saveNewImage(customFile, name);
                    }
                });

            // clears all the templates
            setloadedTemplates(null);
            // removes the image from the screen
            setCurrentDisplayedPicture(null);
            // clears hand-drawn image
            setLines([]);
            goBack();
        };
    };

    const fetchThirdPartyImage = async (url) => {
        const response = await fetch(url);

        // Convert the response data to a Blob
        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], {type: response.headers.get('content-type')});

        const reader = new FileReader();
        reader.readAsDataURL(blob);

        return blob;
    };


    const websiteUrlRef = useRef(null);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const [frame, setFrame] = useState(null);

    const handleScreenshot = async () => {
        try {
            const websiteUrl = websiteUrlRef.current.value;

            // Check if the URL is valid
            if (!websiteUrl || !/^https?:\/\//i.test(websiteUrl)) {
                alert("Please enter a valid URL starting with http:// or https://");
                return;
            }

            // Open the entered URL in a new tab
            window.open(websiteUrl, "_blank");

            // Capture the screen using getDisplayMedia
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {mediaSource: "screen"},
            });

            // Check if videoRef.current is not null before setting srcObject
            if (videoRef.current) {
                // Display the screen capture in a video element
                videoRef.current.srcObject = stream;

                // Wait for the video to be loaded and ready
                await new Promise((resolve) => {
                    videoRef.current.onloadedmetadata = resolve;
                });

                // Set maxWidth and maxHeight properties
                videoRef.current.style.maxWidth = "100%";
                videoRef.current.style.maxHeight = "100%";

                // Create a canvas with the visible dimensions of the video
                const canvas = document.createElement("canvas");
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                const context = canvas.getContext("2d");

                // Draw the video onto the canvas
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

                // Start recording the screen
                mediaRecorderRef.current = new MediaRecorder(stream);
                mediaRecorderRef.current.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        chunksRef.current.push(event.data);
                    }
                };

                mediaRecorderRef.current.onstop = async () => {
                    // Combine recorded chunks into a single Blob
                    const recordedBlob = new Blob(chunksRef.current, {
                        type: "video/mp4",
                    });

                    // Set the source of the video element to the recorded video
                    videoRef.current.src = URL.createObjectURL(recordedBlob);

                    // Play the video
                    videoRef.current.play();

                    // Wait for 5 milliseconds
                    await new Promise((resolve) => setTimeout(resolve, 5));

                    // Draw the frame on the canvas
                    context.drawImage(
                        videoRef.current,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    // Get the data URL of the frame
                    const dataURL = canvas.toDataURL("image/png");

                    // Set the frame to the new image
                    setFrame(dataURL);
                    setScreenShotFile(dataURL);

                    // Stop the stream
                    stream.getTracks().forEach((track) => track.stop());

                    // Reset chunks
                    chunksRef.current = [];


                    const blob = base64toBlob(dataURL);

                    console.log("dataURL: ", blob);
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    try {
                        const randomNumber = Math.random();
                        await ApiController.saveNewImage(blob, 'id-' + randomNumber.toString(16).slice(2));
                    } catch (error) {
                        console.log(error.message);
                    }
                    // removes the image from the screen
                    setCurrentDisplayedPicture(null);
                    // clears hand-drawn image
                    setLines([]);
                    goBack();
                };

                mediaRecorderRef.current.start();

                // Stop recording after 10 ms
                setTimeout(() => {
                    mediaRecorderRef.current.stop();
                }, 10);
            }
        } catch (error) {
            console.error("Error taking screenshot:", error);
        }
    };

    const handleGifUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const imageDataUrl = canvas.toDataURL('image/png');
                setCurrentDisplayedPicture(imageDataUrl);
                setGifFile(base64toBlob(imageDataUrl));
            };
        };

        reader.readAsDataURL(file);

    };
    const [imageSrc, setImageSrc] = useState('');

    const handleVideoUpload = async (event) => {
        const videoFile = event.target.files[0];

        try {
            const firstFrameDataURL = await extractFirstFrameFromVideo(videoFile);
            setVideoFile(base64toBlob(firstFrameDataURL));
            setCurrentDisplayedPicture(firstFrameDataURL);
        } catch (error) {
            console.error('Error extracting first frame:', error);
        }

    };

    const renderSelectedMethodAdditionalUI = () => {
        switch (selectedMethod) {
            case "fileUpload":
                return (
                    <div className="file-upload">
                        <form method="post" encType="multipart/form-data">
                            <input type="file" onChange={handleFileUpload}/>
                        </form>
                    </div>
                );
            case "imageUrlUpload":
                return (
                    <div className="image-url">
                        <input
                            type="text"
                            placeholder="Enter Image URL"
                            className="input input-bordered w-full max-w-ws"
                            onChange={handleImageURLUpload}
                        />
                    </div>
                );
            case "thirdParty":
                return (
                    <div className="third-party">
                        <input
                            className="input input-bordered w-full max-w-ws"
                            type="text"
                            placeholder="Enter Third Party Image URL"
                            onChange={handleThirdPartyImage}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleButtonClickThirdPartyURL}
                        >
                            Load Memes from Website
                        </button>
                        {loadedTemplates && (
                            <ul>
                                {loadedTemplates.map((loadedTemplate, index) => (
                                    <React.Fragment key={index}>
                                        <li>{loadedTemplate.name}</li>
                                        <li>
                                            <img
                                                src={loadedTemplate.url}
                                                alt={loadedTemplate.name}
                                                onClick={() => handleThirdPartyPictureClick(loadedTemplate.url, loadedTemplate.name)}
                                            />
                                        </li>
                                    </React.Fragment>
                                ))}
                            </ul>
                        )}
                        <p>URL to try: https://api.imgflip.com/get_memes</p>
                    </div>
                );
            case "screenshot":
                return (
                    <div className="screenshot">
                        <div>
                            <label className="text-lg" htmlFor="websiteUrl">
                                Enter Website URL:
                            </label>
                            <input
                                type="text"
                                placeholder="Insert URL"
                                className="input input-bordered w-full max-w-ws"
                                id="websiteUrl"
                                ref={websiteUrlRef}
                            />
                        </div>
                        <button className="btn btn-primary" onClick={handleScreenshot}>
                            Take Screenshot
                        </button>
                        {screenShotFile && (
                            <button
                                className="btn btn-primary"
                                onClick={saveDataIntoDatabase}
                            >
                                Save Screenshot
                            </button>
                        )}
                        {frame && <img src={frame} alt="Extracted Frame"/>}
                        <video ref={videoRef} controls style={{display: "none"}}></video>
                    </div>
                );
            case "camera":
                return (
                    <div className="camera-capture">
                        <button className="btn btn-primary" onClick={handleCameraImage}>
                            Capture from Camera
                        </button>
                    </div>
                );
            case "draw":
                return handleHandDrawnImage();
            case "gif":
                return (
                    <div>
                        <input type="file" accept="image/gif" onChange={handleGifUpload}/>
                    </div>
                );
            case "video":
                return (
                    <div>

                        <input type="file" accept="video/*" onChange={handleVideoUpload}/>
                        {imageSrc && <img src={imageSrc} alt="Converted Image" />}
                    </div>
                );
            default:
                return null;
        }
    };


    const saveDataIntoDatabase = async () => {
        switch (selectedMethod) {
            case "fileUpload":
                console.log("File Upload", uploadedFile);
                try {
                    const randomNumber = Math.random();
                    await ApiController.saveNewImage(uploadedFile, 'id-' + randomNumber.toString(16).slice(2));
                } catch (error) {
                    console.log(error.message);
                }
                break;
            case "imageUrlUpload":
                console.log("Image URL");
                fetchThirdPartyImage(urlImageFile)
                    .then(image => {
                        if (image) {
                            const randomNumber = Math.random();
                            ApiController.saveNewImage(image, 'id-' + randomNumber.toString(16).slice(2));
                        }
                    });
                break;
            case "thirdParty":
                //Implemented but in other method --> handleThirdPartyPictureClick()
                console.log("Third Party");
                break;
            case "screenshot":
                //implemented but in other method --> handleScreenshot()
                console.log("Screenshot");
                break;
            case "camera":
                console.log("Camera");
                const blob = base64toBlob(cameraFile);

                const reader = new FileReader();
                reader.readAsDataURL(blob);
                try {
                    const randomNumber = Math.random();
                    await ApiController.saveNewImage(blob, 'id-' + randomNumber.toString(16).slice(2));
                } catch (error) {
                    console.log(error.message);
                }
                break;
            case "draw":
                console.log("draw");
                const stage = stageRef.current;
                const dataURL = stage.toDataURL();

                const blobDraw = base64toBlob(dataURL);

                const readerDraw = new FileReader();
                readerDraw.readAsDataURL(blobDraw);
                try {
                    const randomNumber = Math.random();
                    await ApiController.saveNewImage(blobDraw, 'id-' + randomNumber.toString(16).slice(2));
                } catch (error) {
                    console.log(error.message);
                }
                break;
            case "gif":
                console.log("gif");
                try {
                    console.log("gifFile: ", gifFile)
                    const randomNumber = Math.random();
                    await ApiController.saveNewImage(gifFile, 'id-' + randomNumber.toString(16).slice(2));
                } catch (error) {
                    console.log(error.message);
                }
                break;
            case "video":
                console.log("video");
                try {
                    const randomNumber = Math.random();
                    await ApiController.saveNewImage(videoFile, 'id-' + randomNumber.toString(16).slice(2));
                } catch (error) {
                    console.log(error.message);
                }
                break;
            default:
                console.log("No method selected - nothing to save in DB");
        }
        // removes the image from the screen
        setCurrentDisplayedPicture(null);
        // clears hand-drawn image
        setLines([]);
        goBack();
    };

    const renderSelectedMethodInterface = () => {
        return (
            <div className="selected-method-interface">
                <label className="text-lg font-bold">Select Upload Method:</label>
                <select
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                >
                    <option value="fileUpload">File Upload</option>
                    <option value="imageUrlUpload">Image URL</option>
                    <option value="thirdParty">Third Party Service</option>
                    <option value="screenshot">Screenshot URL</option>
                    <option value="camera">Connected Camera</option>
                    <option value="draw">Hand-Drawn-Picture</option>
                    <option value="gif">Gif</option>
                    <option value="video">Video</option>
                </select>
                {renderSelectedMethodAdditionalUI()}
            </div>
        );
    };

    return (
        <BaseLayout>
            <div className="container justify-left grid min-h-screen w-full px-6 align-top md:justify-center md:px-12">
                <div className="h-fit">
                    <h1 className="text-5xl font-bold">Template Upload</h1>
                </div>
                {renderSelectedMethodInterface()}
                {currentDisplayedPicture && selectedMethod !== "draw" && (
                    <div className="image-container">
                        <button
                            className="btn btn-primary"
                            color="primary"
                            onClick={saveDataIntoDatabase}
                        >
                            Upload Image
                        </button>
                        <img
                            src={currentDisplayedPicture}
                            alt="uploaded image"
                            className="captured-image"
                        />
                    </div>
                )}
            </div>
        </BaseLayout>
    );
};

export default AddMethodEditor;
