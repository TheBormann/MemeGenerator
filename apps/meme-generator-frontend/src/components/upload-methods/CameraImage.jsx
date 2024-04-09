class CameraImage {
    static async handleCameraImage(setCameraFile, setCurrentDisplayedPicture) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.createElement('video');
            document.body.appendChild(video);
            video.srcObject = stream;

            return new Promise((resolve) => {
                video.addEventListener('loadeddata', () => resolve(video));
                video.play();
            })
                .then((video) => {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const context = canvas.getContext('2d');

                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const capturedImage = canvas.toDataURL('image/png');
                    setCameraFile(capturedImage);
                    setCurrentDisplayedPicture(capturedImage);
                    stream.getTracks().forEach((track) => track.stop());

                    if (document.body.contains(video)) {
                        document.body.removeChild(video);
                    }

                    if (document.body.contains(canvas)) {
                        document.body.removeChild(canvas);
                    }
                });
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    }
}

export default CameraImage;
