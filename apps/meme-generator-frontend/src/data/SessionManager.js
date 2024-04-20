const SessionManager = {
  getUserName() {
    const userData = sessionStorage.getItem("userData");
    if (!userData) {
      return "No data";
    }
    return JSON.parse(userData).username;
  },
  getEmail() {
    const userData = sessionStorage.getItem("userData");
    if (!userData) {
      return "No data";
    }
    return JSON.parse(userData).email;
  },
  getSpeechSettings() {
    const userData = sessionStorage.getItem("userData");
    if (!userData) {
      return "No data";
    }
    const json = JSON.parse(userData);
    return {
      read_feed: json.read_feed,
      read_details: json.read_details,
      read_comments: json.read_comments
    };
  },
};

export default SessionManager;
