import React, { useEffect, useState, useRef } from "react";
import ImageProcess from "../components/imageProcess";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

const Camera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);
  const [stream, setStream] = useState(null);
  let navigate = useNavigate();
  const getCameraStream = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }
  };
  useEffect(() => {
    getCameraStream();

    return () => {
      if (videoRef.current) {
        setStream(videoRef.current.srcObject);
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, []);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/png");
      setImage(imageData);
    }
  };

  const retryCapture = async () => {
    setImage(null);
    getCameraStream();
  };

  const handleFileSelect = async (event) => {
    setImage(await toBase64(event.target.files[0]));
  };
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  return (
    <div className="relative h-screen flex items-center justify-center">
      {!image ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-8 left-8 transform bg-transparent bg-opacity-50 p-4 bg-white font-bold rounded-full flex items-center justify-center"
          >
            <svg
              fill="#000000"
              width="20"
              height="20"
              viewBox="0 0 52 52"
              data-name="Layer 1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M50,24H6.83L27.41,3.41a2,2,0,0,0,0-2.82,2,2,0,0,0-2.82,0l-24,24a1.79,1.79,0,0,0-.25.31A1.19,1.19,0,0,0,.25,25c0,.07-.07.13-.1.2l-.06.2a.84.84,0,0,0,0,.17,2,2,0,0,0,0,.78.84.84,0,0,0,0,.17l.06.2c0,.07.07.13.1.2a1.19,1.19,0,0,0,.09.15,1.79,1.79,0,0,0,.25.31l24,24a2,2,0,1,0,2.82-2.82L6.83,28H50a2,2,0,0,0,0-4Z" />
            </svg>
          </button>

          <div className="absolute top-8 right-8 transform text-lg flex flex-col items-end">
            <Link
              to={"/manual-entry"}
              className="mb-8  bg-transparent bg-opacity-50 py-2 px-4 bg-white font-bold rounded-full items-center justify-center"
            >
              manual entry
            </Link>

            <input
              id="file-input"
              name="file-input"
              className="hidden"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
            />
            <label
              for="file-input"
              className="  bg-transparent bg-opacity-50 py-2 px-4 bg-white font-bold rounded-full items-center justify-center"
            >
              upload image
            </label>
          </div>
          <button
            onClick={capturePhoto}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white outline-gray-600 outline-4 text-white text-3xl font-bold rounded-full w-20 h-20 flex items-center justify-center focus:outline-none"
          >
            📸
          </button>

          {/* Hidden Canvas for Photo */}
          <canvas
            ref={canvasRef}
            className="hidden"
            width={1000}
            height={1000}
          />
        </>
      ) : (
        <ImageProcess image={image} retryCapture={retryCapture} />
      )}
    </div>
  );
};

export default Camera;
