// utils/auth.js
export function logout() {
  // Remove the access token (and any other auth-related data) from storage
  localStorage.removeItem("access_token");
  localStorage.removeItem("user"); // if you're storing user data
  // You can also remove refresh_token or any other data if applicable
}
