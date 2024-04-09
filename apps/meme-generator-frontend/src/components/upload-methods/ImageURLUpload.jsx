class ImageURLUpload {
    static handleImageURLUpload(event, setCurrentDisplayedPicture, setUrlImageFile) {
        const imageUrl = event.target.value;

        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageUrl;

        img.onload = () => {
            setCurrentDisplayedPicture(img.src);
            setUrlImageFile(img.src);
        };

        img.onerror = () => {
            console.error('Error loading image from URL');
        };
    }
}

export default ImageURLUpload;
