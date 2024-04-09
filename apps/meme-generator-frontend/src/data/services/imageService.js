import ApiController from "../ApiController";
const API_BASE_URL = ApiController.API_BASE_URL;

const ImageService = {

    async getRandomTemplate() {
        try {
            const templates = await ApiController.fetchAllTemplates();

            const index = getRandomIndex(templates);

            const randomTemplate = templates[index];

            return [randomTemplate, index];
        } catch (error) {
            console.error('Error fetching meme image:', error);
            return null;
        }
    },

    toSrcPath(suffix) {
        return `${API_BASE_URL}/${suffix}`;
    }
}

function getRandomIndex(arr) {
   return Math.floor(Math.random() * arr.length);
}

export default ImageService;