import ImageService from "../services/imageService";

function getFullImagePaths(templates) {
    const imagePaths = templates.map(item => ImageService.toSrcPath(item.imagePath));
    return imagePaths;
}

export default getImagePaths;