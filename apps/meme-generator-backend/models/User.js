class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.resetToken = null;
    this.tokenExpiry = null;
    this.read_feed = false;
    this.read_details = false;
    this.read_comments = false;
  }
}

module.exports = User;
