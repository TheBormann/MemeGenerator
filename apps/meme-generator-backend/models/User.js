class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.resetToken = null;
    this.tokenExpiry = null;
  }
}

module.exports = User;
