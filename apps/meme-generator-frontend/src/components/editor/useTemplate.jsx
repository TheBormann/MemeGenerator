import { useState, useEffect } from 'react';
import ApiController from '../../data/ApiController';
import SessionManager from '../../data/SessionManager';

const API_BASE_URL = ApiController.API_BASE_URL;

const useTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [draft, setDraft] = useState({ imageUrl: "", templateId: "" });
  const [templateIndex, setTemplateIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    showPublic: true,
    showUploaded: false
  });

  useEffect(() => {
    randomizeTemplate();
    fetchTemplates();
  }, []);

  const toSrcPath = (suffix) => {
    return `${API_BASE_URL}/${suffix}`;
}

  const fetchTemplates = async (authors = []) => {
    try {
      setLoading(true);
      const templates = await ApiController.fetchAllTemplates(authors);
      const newTemplates = templates.map(item => ({
        id: item._id,
        name: item.name,
        url: toSrcPath(item.imagePath),
      }));
      setTemplates(newTemplates);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

    const getRandomIndex = (arr) => {
        return Math.floor(Math.random() * arr.length);
    }

  const randomizeTemplate = async () => {
    try {
        const templates = await ApiController.fetchAllTemplates();
        console.log(templates);

        const index = getRandomIndex(templates);

        const randomTemplate = templates[index];

        setDraft({
            templateId: randomTemplate.name,
            imageUrl: toSrcPath(randomTemplate.imagePath),
          });

          setTemplateIndex(index);
    } catch (error) {
        console.error('Error fetching meme image:', error);
        return null;
    }
  }

  const updateSelectedTemplate = (image) => {
    setDraft({
      imageUrl: image.url,
      templateId: image.id
    });
    setTemplateIndex(templates.indexOf(image));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const selectNextTemplate = () => {
    const idx = (templateIndex + 1) % templates.length;
    setDraft({
      templateId: templates[idx].id,
      imageUrl: templates[idx].url,
    });
    setTemplateIndex(idx);
  }

  const selectPrevTemplate = () => {
    const idx = (templateIndex + templates.length - 1) % templates.length;
    setDraft({
      templateId: templates[idx].id,
      imageUrl: templates[idx].url,
    });
    setTemplateIndex(idx);
  }

  const onFilterChange = async (option) => {
    let { showPublic, showUploaded } = filterOptions;
    if (option === "public") {
      showPublic = !showPublic;
    } else {
      showUploaded = !showUploaded;
    }
    setFilterOptions({ showPublic, showUploaded });

    let authors = [];
    if (showPublic) authors.push("public");
    if (showUploaded) authors.push(SessionManager.getUserName());
    await fetchTemplates(authors);
  }

  return { templates, draft, loading, filterOptions, randomizeTemplate, updateSelectedTemplate, selectNextTemplate, selectPrevTemplate, onFilterChange };
};

export default useTemplate;
