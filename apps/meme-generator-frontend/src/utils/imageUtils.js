import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";

export async function createNewImage(node, quality) {
  return await htmlToImage.toJpeg(node, { quality: quality });
}

export function getFileSizeFromBase64(base64String) {
  // Remove the base64 prefix if it exists
  const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, "");

  // Decode the base64 string into binary data
  const binaryData = atob(base64Data);

  // Calculate the file size in bytes
  const fileSizeInBytes = binaryData.length;

  return fileSizeInBytes;
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export const base64toBlob = (base64String) => {
  let contentType = "image/png";
  let base64Data = base64String.split(",")[1];
  const binaryData = atob(base64Data);
  const arrayBuffer = new ArrayBuffer(binaryData.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
  }
  return new Blob([arrayBuffer], {type: contentType});
};

export const extractFirstFrameFromVideo = async (videoFile) => {
  return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(videoFile);
      video.onloadedmetadata = () => {
          video.currentTime = 0.1; // Attempt to seek to the first frame
      };
      video.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
      };
      video.onerror = (error) => {
          reject(error);
      };
  });
};