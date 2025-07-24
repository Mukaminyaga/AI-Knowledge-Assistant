import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

// Get auth token
const getAuthToken = () => localStorage.getItem("token");

// Get all departments
export const getDepartments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/departments/`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
};

// Create new department
export const createDepartment = async (departmentData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/departments/`,
      departmentData,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating department:", error);
    throw error;
  }
};

// Update department
export const updateDepartment = async (id, departmentData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/departments/${id}`,
      departmentData,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating department:", error);
    throw error;
  }
};

// Delete department
export const deleteDepartment = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/departments/${id}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
  } catch (error) {
    console.error("Error deleting department:", error);
    throw error;
  }
};

// Get documents by department
export const getDocumentsByDepartment = async (departmentId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/documents/department/${departmentId}`,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching documents by department:", error);
    throw error;
  }
};
