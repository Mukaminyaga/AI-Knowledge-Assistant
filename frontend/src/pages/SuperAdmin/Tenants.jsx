import React, { useState, useEffect } from "react";
import axios from "axios";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";
import TenantTable from "../../components/SuperAdmin/TenantTable";
import TenantForm from "../../components/SuperAdmin/TenantForm";
import { FiPlus, FiDownload } from "react-icons/fi";
import "../../styles/SuperAdmin.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ThemeToggle from "../../components/ThemeToggle";

const API_URL = process.env.REACT_APP_API_URL;

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await axios.get(`${API_URL}/tenants/tenants`);
      setTenants(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch tenants");
    }
  };

  const handleAddTenant = () => {
    setEditingTenant(null);
    setIsFormOpen(true);
  };

  const handleEditTenant = (tenant) => {
    setEditingTenant(tenant);
    setIsFormOpen(true);
  };

  // const handleDeleteTenant = async (tenant) => {
  //   if (!window.confirm(`Delete ${tenant.company_name}?`)) return;

  //   try {
  //     await axios.delete(`${API_URL}/tenants/tenants/${tenant.id}`);
  //     setTenants((prev) => prev.filter((t) => t.id !== tenant.id));
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to delete tenant");
  //   }
  // };

  const handleFormSubmit = (tenantData) => {
    if (editingTenant) {
      setTenants((prev) =>
        prev.map((t) => (t.id === tenantData.id ? tenantData : t)),
      );
    } else {
      setTenants((prev) => [...prev, tenantData]);
    }
    setIsFormOpen(false);
    setEditingTenant(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTenant(null);
  };

  const handleStatusChange = (tenantId, newStatus) => {
    setTenants((prev) =>
      prev.map((tenant) =>
        tenant.id === tenantId ? { ...tenant, status: newStatus } : tenant,
      ),
    );
  };

  const handleExport = (type, exportData = []) => {
    if (!exportData.length) return;

    const tableColumn = [
      "Serial Number",
      "Company Name",
      "Country",
      "Plan",
      "Monthly Fee",
      "Max Users",
      "Status",
    ];

    const tableRows = exportData.map((tenant) => [
      tenant.serial_code || "",
      tenant.company_name,
      tenant.country || "",
      tenant.plan || "",
      tenant.monthly_fee,
      tenant.max_users,
      tenant.status,
    ]);

    if (type === "pdf") {
      const doc = new jsPDF();

      // Generate report metadata
      const reportDate = new Date();
      const reportId = `TP-${reportDate.getFullYear()}${(reportDate.getMonth() + 1).toString().padStart(2, "0")}${reportDate.getDate().toString().padStart(2, "0")}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Calculate date range (assuming last 30 days for demonstration)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      };

      const formatDateTime = (date) => {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      };

      // Add logo at top left
      try {
        const logoImg = new Image();
        logoImg.src = "/Good Partners Main Logo II.jpg";
        logoImg.onload = function () {
          // Add logo to PDF (positioned at top left)
          doc.addImage(logoImg, "JPEG", 10, 8, 40, 25);

          // Continue with PDF generation
          generatePDFContent();
        };
        logoImg.onerror = function () {
          // If logo fails to load, continue without it
          generatePDFContent();
        };
      } catch (error) {
        // Fallback: continue without logo
        generatePDFContent();
      }

      function generatePDFContent() {
        // Header section with improved styling
        doc.setDrawColor(44, 62, 80); // Darker blue color
        doc.setLineWidth(1.5);
        doc.line(30, 45, 180, 45); // Top line

        // Report Title (Center)
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(44, 62, 80); // Dark blue-gray
        const titleText = "TENANT MANAGEMENT REPORT";
        const titleWidth = doc.getTextWidth(titleText);
        doc.text(titleText, (doc.internal.pageSize.width - titleWidth) / 2, 30);

        // Reset font for other text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(52, 73, 94); // Medium gray

        // Report metadata section
        let yPosition = 55;
        const leftMargin = 25;
        const rightMargin = 105;

        // Left column
        doc.setFont("helvetica", "bold");
        doc.text("Generated by:", leftMargin, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text("Good Partners", leftMargin + 25, yPosition);

        // Right column
        doc.setFont("helvetica", "bold");
        doc.text("Report Period:", rightMargin, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(
          `${formatDate(startDate)} to ${formatDate(endDate)}`,
          rightMargin + 27,
          yPosition,
        );

        yPosition += 8;

        // Left column
        doc.setFont("helvetica", "bold");
        doc.text("Report Generated On:", leftMargin, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(formatDateTime(reportDate), leftMargin + 35.3, yPosition);

        // Right column
        doc.setFont("helvetica", "bold");
        doc.text("Report Reference ID:", rightMargin, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(reportId, rightMargin + 37, yPosition);

        yPosition += 8;

        // Total records
        doc.setFont("helvetica", "bold");
        doc.text("Total Number of Records:", leftMargin, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(`${exportData.length} tenants`, leftMargin + 45, yPosition);

        // Status breakdown
        const activeCount = exportData.filter(
          (t) => t.status === "active",
        ).length;
        const inactiveCount = exportData.filter(
          (t) => t.status === "inactive",
        ).length;
        const suspendedCount = exportData.filter(
          (t) => t.status === "suspended",
        ).length;

        doc.setFont("helvetica", "bold");
        doc.text("Status Breakdown:", rightMargin, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Active: ${activeCount}, Inactive: ${inactiveCount}, Suspended: ${suspendedCount}`,
          rightMargin + 32,
          yPosition,
        );

        // Bottom line
        yPosition += 12;
        doc.setDrawColor(44, 62, 80);
        doc.setLineWidth(1);
        doc.line(30, yPosition, 180, yPosition);

        // Table with modern styling
        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: yPosition + 8,
          styles: {
            fontSize: 8,
            cellPadding: 3,
            overflow: "linebreak",
          },
          headStyles: {
            fillColor: [66, 133, 244], // Blue header
            textColor: [255, 255, 255], // White text
            fontSize: 8,
            fontStyle: "bold",
            cellPadding: 2,
          },
          alternateRowStyles: {
            fillColor: [248, 249, 250], // Light gray alternate rows
          },
         columnStyles: {
  0: { cellWidth: 20 }, // First Name
  1: { cellWidth: 20 }, // Last Name
  2: { cellWidth: 25 }, // Company
  3: { cellWidth: 30 }, // Email
  4: { cellWidth: 25 }, // Slug
  5: { cellWidth: 25 }, // Phone
  6: { cellWidth: 30 }, // Billing Address
  7: { cellWidth: 20, halign: "right" }, // Monthly Fee
  8: { cellWidth: 15, halign: "center" }, // Max Users
  9: { cellWidth: 15, halign: "center" }, // Status
  10: { cellWidth: 20 }, // Serial Code
  11: { cellWidth: 25 }, // Created At
},

          margin: { top: 10, right: 20, bottom: 20, left: 20 },
          didDrawPage: function (data) {
            // Add page footer
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(
              "Good Partners - Confidential",
              20,
              doc.internal.pageSize.height - 10,
            );
            doc.text(
              `Page ${data.pageNumber}`,
              doc.internal.pageSize.width - 30,
              doc.internal.pageSize.height - 10,
            );
          },
        });

        // Save the PDF
        doc.save(`tenant-report-${reportId}.pdf`);
      }
    }

    if (type === "csv") {
      const wsData = [tableColumn, ...tableRows];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Tenants");
      XLSX.writeFile(wb, `tenants-${statusFilter}.xlsx`);
    }
  };

  const filteredTenants =
    statusFilter === "all"
      ? tenants
      : tenants.filter((tenant) => tenant.status === statusFilter);

  const totalTenants = tenants.length;
  const activeTenants = tenants.filter((t) => t.status === "active").length;
  const inactiveTenants = tenants.filter((t) => t.status === "inactive").length;
  const suspendedTenants = tenants.filter(
    (t) => t.status === "suspended",
  ).length;
  const totalMRR = tenants
    .filter((t) => t.status === "active")
    .reduce((sum, t) => sum + (t.monthly_fee || 0), 0);

  return (
    <SuperAdminLayout activePage="tenants">
      <div className="tenants-page">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Tenant Management</h1>
            <p className="page-subtitle">
              Manage all your tenants and their subscriptions
            </p>
          </div>
          <div className="page-header-actions">
                            <ThemeToggle className="dashboard-theme-toggle" />

            <div className="btn-group">
              <div className="export-dropdown">
                <button className="btn btn-secondary dropdown-toggle">
                  <FiDownload className="btn-icon" />
                  Export
                </button>
                <div className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={() => handleExport("csv", filteredTenants)}
                  >
                    Export as CSV
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => handleExport("pdf", filteredTenants)}
                  >
                    Export as PDF
                  </button>
                </div>
              </div>
            </div>

            <button className="btn btn-primary" onClick={handleAddTenant}>
              <FiPlus className="btn-icon" />
              Add Tenant
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-buttons">
          {["all", "active", "inactive", "suspended"].map((status) => (
            <button
              key={status}
              className={`filter-btn ${statusFilter === status ? "active" : ""}`}
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="tenant-stats">
          <div className="stat-item">
            <div className="stat-value">{totalTenants}</div>
            <div className="stat-label">Total Tenants</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{activeTenants}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{inactiveTenants}</div>
            <div className="stat-label">Inactive</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{suspendedTenants}</div>
            <div className="stat-label">Suspended</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">KES {totalMRR.toLocaleString()}</div>
            <div className="stat-label">Monthly Revenue</div>
          </div>
        </div>

        {/* Filter Results */}
        <div className="advanced-filters">
          <div className="filter-results">
            Showing {filteredTenants.length} of {totalTenants} tenants
          </div>
        </div>

        {/* Table */}
        <div className="tenants-table-section">
          <TenantTable
            tenants={filteredTenants}
            onView={(t) => console.log("Viewing tenant:", t)}
            onEdit={handleEditTenant}
            onStatusChange={handleStatusChange}
            // onDelete={handleDeleteTenant}
            showActions={true}
          />
        </div>

        {/* Tenant Form */}
        <TenantForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          initialData={editingTenant}
        />
      </div>
    </SuperAdminLayout>
  );
};

export default Tenants;
