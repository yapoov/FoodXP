import React, { useEffect, useState, useRef } from "react";
import ImageProcess from "../components/imageProcess";

const Camera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);
  const [stream, setStream] = useState(null);
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
    <div className="relative w-full h-screen flex items-center justify-center">
      {!image ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <button
            onClick={capturePhoto}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white outline-gray-600 outline-4 text-white text-3xl font-bold rounded-full w-20 h-20 flex items-center justify-center focus:outline-none"
          >
            📸
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute top-8 transform "
          />
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
