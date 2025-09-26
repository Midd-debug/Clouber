import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// --- Token ---
export const setToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

// --- Registro ---
export const registerUser = (data) => API.post("/register/", data);

// --- Login (no necesita Authorization todavía) ---
export const loginUser = (data) =>
  API.post(
    "/token",
    new URLSearchParams({
      username: data.username,
      password: data.password,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

// --- Chat y tareas (usarán token ya seteado con setToken) ---
export const sendChat = (question) => API.post("/chat/", { question });
export const getTasks = () => API.get("/tasks/");
export const addTask = (task) => API.post("/tasks/", task);
