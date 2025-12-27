import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    "http://localhost:3000",
  timeout: 60000, // Increased to 60 seconds for Render cold starts
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle timeout errors
    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      console.warn(
        "Request timeout - Render service may be waking up from sleep"
      );
      error.message = "Server is starting up, please try again in a moment...";
    }

    // Handle network errors
    if (error.code === "ERR_NETWORK") {
      console.warn("Network error - checking server connection");
      error.message =
        "Unable to connect to server. Please check your internet connection.";
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      // Dispatch custom event to notify App component of auth change
      window.dispatchEvent(new Event("authChange"));

      // Only redirect if we're not already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Function to wake up Render service
export const wakeUpServer = async () => {
  try {
    console.log("Waking up server...");
    await api.get("/health", { timeout: 30000 });
    console.log("Server is awake");
    return true;
  } catch (error) {
    console.warn("Server wake up failed:", error.message);
    return false;
  }
};

export default api;
