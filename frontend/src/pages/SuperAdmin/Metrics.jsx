import React, { useEffect, useState } from "react";
import axios from "axios";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";
import TenantMetricsTable from "../../components/SuperAdmin/TenantMetricsTable";
import { 
  FiUsers, 
  FiDollarSign, 
  FiAlertTriangle, 
  FiTrendingUp, 
  FiFileText,
  FiActivity,
  FiDatabase,
  FiUpload
} from "react-icons/fi";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import "../../styles/SuperAdmin.css";
import ThemeToggle from "../../components/ThemeToggle";

const API_URL = process.env.REACT_APP_API_URL;

const Metrics = () => {
  const [dashboardData, setDashboardData] = useState({
    total_tenants: 0,
    monthly_recurring_revenue: 0,
    total_documents: 0,
    this_months_payments_total: 0,
    overdue_payments: 0,
    recent_tenants: [],
  });
  const [tenantMetrics, setTenantMetrics] = useState([]);
  const [activityTrends, setActivityTrends] = useState([]);
  const [featureUsage, setFeatureUsage] = useState([]);
  const [storage, setStorage] = useState(null);
  const [loginFailures, setLoginFailures] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("7d");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const MAX_STORAGE = 3 * 1024 * 1024 * 1024 * 1024; // 3 TB in bytes


  const user = JSON.parse(localStorage.getItem("user"));

  // Sample data for charts (replace with real API data)
  const sampleActivityTrends = [
    { date: 'Jan 01', uploads: 45, views: 120, downloads: 30 },
    { date: 'Jan 02', uploads: 52, views: 140, downloads: 35 },
    { date: 'Jan 03', uploads: 48, views: 135, downloads: 28 },
    { date: 'Jan 04', uploads: 61, views: 160, downloads: 42 },
    { date: 'Jan 05', uploads: 55, views: 145, downloads: 38 },
    { date: 'Jan 06', uploads: 67, views: 180, downloads: 45 },
    { date: 'Jan 07', uploads: 59, views: 155, downloads: 40 }
  ];

  const sampleFeatureUsage = [
    { feature: 'Document Upload', usage: 89, count: 234 },
    { feature: 'AI Chat', usage: 76, count: 198 },
    { feature: 'Document Search', usage: 92, count: 312 },
    { feature: 'Export/Download', usage: 45, count: 127 },
    { feature: 'User Management', usage: 34, count: 89 }
  ];

  useEffect(() => {
    fetchOverviewData();
    fetchTenantMetrics();
  }, [selectedDateRange]);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [overviewRes, documentsRes , storageRes, metricsRes] = await Promise.all([
  axios.get(`${API_URL}/tenants/tenants/dashboard/overview/`, { headers }),
  axios.get(`${API_URL}/documents/superadmin/stats/total-documents/`, { headers }),
  axios.get(`${API_URL}/documents/metrics/storage`, { headers }),
  axios.get(`${API_URL}/metrics/tenants`, { headers }) // ✅ add this
]);


      

      const mergedData = {
        ...overviewRes.data,
        total_documents: documentsRes.data.total_documents
        
      };

      setDashboardData(mergedData);
      setStorage(storageRes.data.total_storage_used);
      setActivityTrends(sampleActivityTrends);
      setFeatureUsage(sampleFeatureUsage);
      setLoginFailures(metricsRes.data.summary.total_login_failures_24h);
      
      
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

const fetchTenantMetrics = async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const response = await axios.get(`${API_URL}/metrics/tenants`, { headers });
    const tenants = response.data.tenants || [];

  const mappedData = tenants.map(t => ({
  id: t.tenant_id,
  company_name: t.tenant_name,
  login_failures_24h: t.login_failures_24h,
  lastActive: t.last_active_user?.last_active || null,
  lastActiveEmail: t.last_active_user?.email || null,
  activeUsers7d: t.active_users_7d,

  //  use both total_uploads and uploads_7d from backend
  totalUploads: t.total_uploads || 0,
  uploadsThisWeek: t.uploads_7d || 0,

  storageUsed: t.storage_used || 0, 
  status: t.status || "active",          //  from backend
  plan: t.plan || "Basic",              // from backend
  monthly_fee: t.monthly_fee || 0,  
  planLimit: t.plan_limit || (5 * 1024 * 1024 * 1024) 
}));


setTenantMetrics(mappedData);

    

  } catch (err) {
    console.error("Failed to fetch tenant metrics:", err);
  }
};


  const formatSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
};



  const filteredTenants = tenantMetrics.filter(tenant => {
    const matchesSearch = tenant.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.contact_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || tenant.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  

  return (
    <SuperAdminLayout activePage="metrics">
      <div className="overview-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Tenant Metrics & Analytics</h1>
            <p className="page-subtitle">
              Monitor tenant usage, system health, and performance metrics
              <br />
              Comprehensive insights into tenant adoption and system status
            </p>
          </div>
          <div className="page-header-actions">
            <ThemeToggle className="dashboard-theme-toggle" />
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon"><FiUsers /></div>
            <div className="metric-content">
              <div className="metric-value">{dashboardData.total_tenants}</div>
              <div className="metric-label">Total Tenants</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon"><FiFileText /></div>
            <div className="metric-content">
              <div className="metric-value">{dashboardData.total_documents}</div>
              <div className="metric-label">Total Documents</div>
            </div>
          </div>
    


  {/*  NEW: Uploads This Week */}
  <div className="metric-card">
    <div className="metric-icon"><FiTrendingUp /></div>
    <div className="metric-content">
      <div className="metric-value">+{dashboardData.total_uploads_7d || 0}</div>
      <div className="metric-label">Uploads This Week</div>
    </div>
  </div>

          <div className="metric-card">
            <div className="metric-icon"><FiDollarSign /></div>
            <div className="metric-content">
              <div className="metric-value">
                KES {dashboardData.monthly_recurring_revenue.toLocaleString()}
              </div>
              <div className="metric-label">Monthly Recurring Revenue</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon"><FiActivity /></div>
            <div className="metric-content">
              <div className="metric-value">{loginFailures}</div>
              <div className="metric-label">Login Failures (24h)</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon"><FiTrendingUp /></div>
            <div className="metric-content">
              <div className="metric-value">
                KES {(dashboardData.this_months_payments_total || 0).toLocaleString()}
              </div>
              <div className="metric-label">This Month's Payments</div>
            </div>
          </div>

          <div className="metric-card">
      <div className="metric-icon"><FiDatabase /></div>
      <div className="metric-content">
        <div className="metric-value">
          {storage !== null ? formatSize(storage) : ""}
        </div>
        <div className="metric-label">Total Storage Used</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Activity Trends</h3>
              <div className="chart-controls">
                <select 
                  value={selectedDateRange} 
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="filter-select"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--card-background)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="uploads" 
                    stroke="#4CAF50" 
                    strokeWidth={2}
                    dot={{ fill: '#4CAF50', strokeWidth: 2, r: 4 }}
                    name="Uploads"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#2563EB" 
                    strokeWidth={2}
                    dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                    name="Views"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="downloads" 
                    stroke="#FF9800" 
                    strokeWidth={2}
                    dot={{ fill: '#FF9800', strokeWidth: 2, r: 4 }}
                    name="Downloads"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Most Used Features</h3>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={featureUsage} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis dataKey="feature" type="category" stroke="#666" width={120} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--card-background)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="usage" fill="#1A1A1A" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tenant Metrics Table */}
        <TenantMetricsTable
          tenants={filteredTenants}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedDateRange={selectedDateRange}
          onDateRangeChange={setSelectedDateRange}
        />

        {/* System Health Summary */}
        <div className="recent-activity-summary">
          <h2 className="section-title">System Health Summary</h2>
          <div className="health-metrics-grid">
            <div className="health-metric">
              <div className="health-icon">
                <FiDatabase />
              </div>
              <div className="health-content">
                <div className="health-value">99.9%</div>
                <div className="health-label">System Uptime</div>
                <div className="health-status success">Excellent</div>
              </div>
            </div>
            
            <div className="health-metric">
              <div className="health-icon">
                <FiActivity />
              </div>
              <div className="health-content">
                <div className="health-value">1.2s</div>
                <div className="health-label">Avg Response Time</div>
                <div className="health-status success">Good</div>
              </div>
            </div>
            
            <div className="health-metric">
              <div className="health-icon">
                <FiAlertTriangle />
              </div>
              <div className="health-content">
                <div className="health-value">{loginFailures}</div>
                <div className="health-label">Failed Logins (24h)</div>
                <div className="health-status warning">Monitor</div>
              </div>
            </div>
            
            <div className="health-metric">
              <div className="health-icon">
                <FiFileText />
              </div>
              <div className="health-content">
                <div className="health-value">
  {storage !== null ? formatSize(storage) : " "}
</div>
<div className="health-label">Total Storage</div>
<div className="health-status success">
  {storage !== null ? `${((storage / MAX_STORAGE) * 100).toFixed(1)}% Used` : "--"}
</div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Metrics;
