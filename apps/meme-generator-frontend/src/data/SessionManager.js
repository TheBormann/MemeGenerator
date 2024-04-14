const SessionManager = {
  getUserName() {
    return JSON.parse(sessionStorage.getItem("userData")).username;
  },
  getEmail() {
    return JSON.parse(sessionStorage.getItem("userData")).email;
  },
  getSpeechSettings() {
    const json = JSON.parse(sessionStorage.getItem("userData"));
    return {"read_feed": json.read_feed, "read_details": json.read_details, "read_comments": json.read_comments};
  },
};

export default SessionManager;
