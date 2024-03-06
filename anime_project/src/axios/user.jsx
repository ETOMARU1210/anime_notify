import axios from "axios";

class User {
  async  signup(username, email, password) {
    return await axios.post("https://anime-notify.onrender.com/api/signup", {
      username,
      email,
      password
    }).then(
      (response) => response.data
    ).catch(
      (e) => JSON.parse(e.request.response));
  }

  async login(email, password) {
    return await axios.post("https://anime-notify.onrender.com/api/login", {
      email,
      password
    }).then(
      response => response.data
    ).catch((e) => JSON.parse(e.request.response));
  }
}

const user = new User();
export default user;
