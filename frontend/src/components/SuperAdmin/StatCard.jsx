import React from "react";
import "../../styles/SuperAdmin.css";

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "blue",
}) => {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-header">
        <div className="stat-card-icon">
          <Icon />
        </div>
        {trend && (
          <div
            className={`stat-trend ${trend.type === "up" ? "trend-up" : "trend-down"}`}
          >
            {trend.type === "up" ? "↗" : "↘"} {trend.value}
          </div>
        )}
      </div>

      <div className="stat-card-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatCard;
