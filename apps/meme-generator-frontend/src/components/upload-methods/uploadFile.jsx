
class uploadFile {
  static async handleFileUpload(event, setCurrentDisplayedPicture, setFile) {
    const uploadedFile = event.target.files[0];

    if (
      uploadedFile &&
      (uploadedFile.type === "image/jpeg" || uploadedFile.type === "image/png")
    ) {
      // Update displayed image
      const reader = new FileReader();
      reader.onload = async (e) => {
        setCurrentDisplayedPicture(e.target.result);
      };
      reader.readAsDataURL(uploadedFile);
      console.log("Uploaded file: ", uploadedFile);
      setFile(uploadedFile);
    }
  }
}

export default uploadFile;
