function GeneratedMemeDialog({ isOpen, name, generatedImage, memeRef, downloadImage, shareMeme, uploadedLink, clear }) {
    if (!isOpen) return null;
  
    return (
      <dialog id="generated_meme_modal" className="modal modal-bottom sm:modal-middle" open={isOpen}>
        <div className="modal-box">
          <h2 className="font-bold text-2xl mb-3">New Meme: {name}</h2>
          {generatedImage == null ? (
            <span className="loading loading-spinner m-auto w-1/4 relative left-1/2 -translate-x-1/2"></span>
          ) : (
            <>
              <img ref={memeRef} src={generatedImage} alt="Generated Meme" />
              <div className="pt-2"></div>
            </>
          )}
          <div className="modal-action">
            <div className="flex flex-col items-end gap-2">
              <div className="flex justify-between">
                <button type="button" className="btn btn-outline mx-2" onClick={downloadImage} disabled={generatedImage == null}>
                  Download
                </button>
                <button type="button" className="btn btn-primary" onClick={shareMeme} disabled={generatedImage == null || uploadedLink != null}>
                  Share
                </button>
              </div>
              {uploadedLink && (
                <div className="join">
                  <span className="label text-label input input-bordered join-item">{uploadedLink}</span>
                  <button className="btn join-item" onClick={() => navigator.clipboard.writeText(uploadedLink)}>
                    Copy
                  </button>
                </div>
              )}
            </div>
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={clear}>
              ✕
            </button>
          </div>
        </div>
      </dialog>
    );
  }

export default GeneratedMemeDialog;