import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DepartmentContext = createContext();

export const DepartmentProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch all departments
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/departments/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  // Create new department
  const createDepartment = async (departmentData) => {
    try {
      console.log("Sending department data:", departmentData); // Debug log
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/departments/`,
        departmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      console.log("Received response:", response.data); // Debug log
      setDepartments(prev => [...prev, response.data]);
      toast.success("Department created successfully");
      return response.data;
    } catch (error) {
      console.error("Error creating department:", error);
      toast.error(error.response?.data?.detail || "Failed to create department");
      throw error;
    }
};
  // Update department
  const updateDepartment = async (id, departmentData) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/departments/${id}`,
        departmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDepartments(prev => 
        prev.map(dept => dept.id === id ? response.data : dept)
      );
      toast.success("Department updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error(error.response?.data?.detail || "Failed to update department");
      throw error;
    }
  };

  // Delete department
  const deleteDepartment = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/departments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDepartments(prev => prev.filter(dept => dept.id !== id));
      toast.success("Department deleted successfully");
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error(error.response?.data?.detail || "Failed to delete department");
      throw error;
    }
  };

  // Initialize departments on mount
  useEffect(() => {
    if (token) {
      fetchDepartments();
    }
  }, [token]);

  const value = {
    departments,
    loading,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };

  return (
    <DepartmentContext.Provider value={value}>
      {children}
    </DepartmentContext.Provider>
  );
};

export const useDepartments = () => {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error("useDepartments must be used within a DepartmentProvider");
  }
  return context;
};
