import React, { useState } from "react";
import api from "../api";
function ImageProcess({ image, retryCapture }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const sendPhoto = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const response = await api.post(
        "/upload-image",
        JSON.stringify({
          image: image.replace(/^data:image\/png;base64,/, ""), // Send only Base64 string
        })
      );
      setResults(response.data.products);
    } catch (error) {
      console.error("Error sending photo: ", error);
      alert("Error sending photo");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center">
      {results.length == 0 ? (
        <>
          <div>
            <img
              src={image}
              alt="Captured"
              className=" h-full w-auto object-cover"
            />
            {loading && (
              <div className="text-center">
                <p>Processing the image, please wait...</p>
                <div className="loader"></div>
              </div>
            )}
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={retryCapture}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Retry
            </button>
            <button
              onClick={sendPhoto}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Send
            </button>
          </div>{" "}
        </>
      ) : (
        <div className="mt-6 w-full max-w-md">
          <h3 className="text-lg font-semibold">Extracted Products:</h3>
          <ul className="list-disc list-inside">
            {results.map((e) => (
              <div>{e["Product Name"]}</div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ImageProcess;
