import axios from "axios";

const API = axios.create({
 baseURL: "http://localhost:30001",
});

export default API;