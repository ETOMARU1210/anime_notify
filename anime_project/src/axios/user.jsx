import axios from "axios";

class User {
  
  API_URL ="https://anime-notify.onrender.com";
  async signup(username, email, password) {
    return await axios
      .post(`${this.API_URL}/api/signup`, {
        username,
        email,
        password,
      })
      .then((response) => response.data)
      .catch((e) => JSON.parse(e.request.response));
  }

  async login(email, password) {
    return await axios
      .post(`${this.API_URL}/api/login`, {
        email,
        password,
      })
      .then((response) => response.data)
      .catch((e) => JSON.parse(e.request.response));
  }
}

const user = new User();
export default user;
