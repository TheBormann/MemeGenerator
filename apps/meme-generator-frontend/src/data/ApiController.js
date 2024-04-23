import SessionManager from "./SessionManager";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const authToken = sessionStorage.getItem("authToken");

const ApiController = {
  API_BASE_URL: API_BASE_URL,
  PAGE_LIMIT: 10,

  async saveNewImage(imageData, imageName) {
    const formData = new FormData();
    formData.append("image", imageData, imageName);
    formData.append(
      "name",
      `Template`
    );
    formData.append("author", SessionManager.getUserName());
    formData.append("isPublic", true);
    try {
      const response = await fetch(`${API_BASE_URL}/templates/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An unknown error occurred");
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  },

  async createMeme(formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/memes/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch memes");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  async updateMeme(memeId, formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/memes/${memeId}`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An unknown error occurred during meme update");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },


  async fetchMemeById(memeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/memes/${memeId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch meme");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  async fetchAllMemes({
    page = null,
    limit = this.PAGE_LIMIT,
    filter = null,
    sortedBy = null,
  }) {
    try {
      let url = `${API_BASE_URL}/memes?page=${page}&limit=${limit}`;

      if (filter != null) {
        for (const [key, value] of Object.entries(filter)) {
          if (value) {
            url += `&${key}=${value}`;
          }
        }
      }

      if (sortedBy != null) {
        url += `&sortedBy=${sortedBy}`;
      }
      console.log(url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
        },
        params: {
          page: page,
          limit: limit,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch memes");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  async addComment(memeId, comment, author) {
    const formData = new FormData();
    formData.append("id", memeId);
    formData.append("comment", comment);
    formData.append("author", author);
    try {
      const response = await fetch(`${API_BASE_URL}/memes/addComment`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An unknown error occurred");
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  },

  async like(memeId, author) {
    const formData = new FormData();
    formData.append("id", memeId);
    formData.append("author", author);
    try {
      const response = await fetch(`${API_BASE_URL}/memes/like`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An unknown error occurred");
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  },

  async fetchAllTemplates(authors, isPublic=true) {
    //TODO implement keyword search
    try {
      let routeURL = `${API_BASE_URL}/templates?public=${isPublic}`;
      if (authors.length) {
        let queryParams = authors.map((elem) => `authors=${elem}`).join("&");
        routeURL = `${routeURL}&${queryParams}`;
      }
      console.log(routeURL)
      const response = await fetch(routeURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }
      const data = await response.json();
      return data[['templates']];
    } catch (error) {
      throw error;
    }
  },

  async fetchTemplateById(templateId) {
    try {
      const response = await fetch(`${API_BASE_URL}/templates/${templateId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch meme");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  async signUp(formData) {
    try {
      console.log(formData);
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An unknown error occurred");
      }

      const data = await response.json();
      sessionStorage.setItem("authToken", data.token);
      sessionStorage.removeItem("userData");
      console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  },

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An unknown error occurred");
      }

      const data = await response.json();
      sessionStorage.setItem("authToken", data.token);
      sessionStorage.setItem("authExpiration", data.expiration);
      sessionStorage.removeItem("userData");
      return data;
    } catch (error) {
      throw error;
    }
  },

  async fetchUserData() {
    try {
      const response = await fetch(`${API_BASE_URL}/getUserData`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        // If the token is invalid or expired, clear it from the storage
        if (response.status === 401) {
          sessionStorage.removeItem("authToken");
          sessionStorage.removeItem("userData");
        }
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      sessionStorage.setItem("userData", JSON.stringify(data));
      return data;
    } catch (error) {
      throw error;
    }
  },

  async postUserDataChanges(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/updateUserData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to change user data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  async resetPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An unknown error occurred");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  async setNewPassword(token, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
        },
        body: JSON.stringify({ newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An unknown error occurred");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  // Fetch memes created by the user
  fetchUserMemes: async (page = 0, limit = 10) => {
    try {
      let url = `${API_BASE_URL}/memes?page=${page}&limit=${limit}&author=${SessionManager.getUserName()}`;
      console.log(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Include the Authorization header with the token
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user memes");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default ApiController;
