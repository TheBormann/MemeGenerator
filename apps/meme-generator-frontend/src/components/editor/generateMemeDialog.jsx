function GeneratedMemeDialog({ generate_modal_ref, generatedImage, memeRef, downloadImage, shareMeme, memeId }) {  
    return (
      <dialog ref={generate_modal_ref} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h2 className="font-bold text-2xl mb-3">Your Meme</h2>
          <p className="mb-4">
            Download it or share it online!
          </p>
          {generatedImage == null ? (
            <span className="loading loading-ring m-auto my-[20%] relative left-1/2 -translate-x-1/2"></span>
          ) : (
            <img ref={memeRef} src={generatedImage} alt="Generated Meme" />
          )}
          <div className="modal-action">
            <div className="flex flex-col items-end gap-2">
              <div className="flex justify-between">
                <button type="button" className="btn btn-outline mx-2" onClick={downloadImage} disabled={generatedImage == null}>
                  Download
                </button>
                <button type="button" className="btn btn-primary" onClick={shareMeme} disabled={generatedImage == null}>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
  }

export default GeneratedMemeDialog;