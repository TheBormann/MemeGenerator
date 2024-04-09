const SessionManager = {
  getUserName() {
    return JSON.parse(sessionStorage.getItem("userData")).username;
  },
  getEmail() {
    return JSON.parse(sessionStorage.getItem("userData")).email;
  },
};

export default SessionManager;
