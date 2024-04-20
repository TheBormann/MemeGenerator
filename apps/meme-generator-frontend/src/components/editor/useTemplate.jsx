import { useState, useEffect } from 'react';
import ApiController from '../../data/ApiController';
import SessionManager from '../../data/SessionManager';

const API_BASE_URL = ApiController.API_BASE_URL;

const useTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [templateIndex, setTemplateIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    public: true,
    upload: false,
    keywords: ""
  });

  const toSrcPath = (suffix) => {
    return `${API_BASE_URL}/${suffix}`;
  }

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        let authors = [];
        if (filterOptions.upload) authors.push(SessionManager.getUserName());

        const templates = await ApiController.fetchAllTemplates(authors, filterOptions.public);
        console.log(templates)
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

    fetchTemplates();
  }, [filterOptions]);

  const onFilterChange = (option) => {
    setFilterOptions(prevOptions => {
      const updatedOptions = {
        ...prevOptions,
        [option]: !prevOptions[option]
      };
      return updatedOptions;
    });
  }

  return { templates, loading, filterOptions, onFilterChange };
};

export default useTemplate;
