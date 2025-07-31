import React from "react";
import "../../styles/UserRolesSection.css";

function UserRolesSection() {
  const userRoles = [
    {
      title: "Frontline Staff",
      description: "Ask questions and get instant answers to improve productivity",
      bgColor: "rgba(71, 154, 255, 0.10)",
      iconColor: "#479AFF",
      icon: (
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M66.6797 52.5195C72.1597 56.2395 75.9997 61.2795 75.9997 67.9995V79.9995H91.9997V67.9995C91.9997 59.2795 77.7197 54.1195 66.6797 52.5195Z" fill="#479AFF"/>
          <path d="M36 48C44.8366 48 52 40.8366 52 32C52 23.1634 44.8366 16 36 16C27.1634 16 20 23.1634 20 32C20 40.8366 27.1634 48 36 48Z" fill="#479AFF"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M36 52C25.32 52 4 57.36 4 68V80H68V68C68 57.36 46.68 52 36 52Z" fill="#479AFF"/>
        </svg>
      )
    },
    {
      title: "Managers",
      description: "Monitor knowledge gaps, view analytics, and manage content updates",
      bgColor: "rgba(0, 255, 255, 0.10)",
      iconColor: "#00FFFF",
      icon: (
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 40H36V80H24V40ZM24 20H36V36H24V20ZM64 64H76V80H64V64ZM64 52H76V60H64V52ZM44 52H56V80H44V52ZM44 36H56V48H44V36Z" fill="#00FFFF"/>
        </svg>
      )
    },
    {
      title: "IT Admins",
      description: "Integrate Vala.ai with existing systems (Slack, SharePoint, etc.)",
      bgColor: "rgba(168, 85, 247, 0.10)",
      iconColor: "#A855F7",
      icon: (
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M76.5604 51.7596C76.7204 50.5596 76.8004 49.3196 76.8004 47.9996C76.8004 46.7196 76.7204 45.4396 76.5204 44.2396L84.6404 37.9196C85.3604 37.3596 85.5604 36.2796 85.1204 35.4796L77.4404 22.1996C76.9604 21.3196 75.9604 21.0396 75.0804 21.3196L65.5204 25.1596C63.5204 23.6396 61.4004 22.3596 59.0404 21.3996L57.6004 11.2396C57.4404 10.2796 56.6404 9.59961 55.6804 9.59961H40.3204C39.3604 9.59961 38.6004 10.2796 38.4404 11.2396L37.0004 21.3996C34.6404 22.3596 32.4804 23.6796 30.5204 25.1596L20.9604 21.3196C20.0804 20.9996 19.0804 21.3196 18.6004 22.1996L10.9604 35.4796C10.4804 36.3196 10.6404 37.3596 11.4404 37.9196L19.5604 44.2396C19.3604 45.4396 19.2004 46.7596 19.2004 47.9996C19.2004 49.2396 19.2804 50.5596 19.4804 51.7596L11.3604 58.0796C10.6404 58.6396 10.4404 59.7196 10.8804 60.5196L18.5604 73.7996C19.0404 74.6796 20.0404 74.9596 20.9204 74.6796L30.4804 70.8396C32.4804 72.3596 34.6004 73.6396 36.9604 74.5996L38.4004 84.7596C38.6004 85.7196 39.3604 86.3996 40.3204 86.3996H55.6804C56.6404 86.3996 57.4404 85.7196 57.5604 84.7596L59.0004 74.5996C61.3604 73.6396 63.5204 72.3596 65.4804 70.8396L75.0404 74.6796C75.9204 74.9996 76.9204 74.6796 77.4004 73.7996L85.0804 60.5196C85.5604 59.6396 85.3604 58.6396 84.6004 58.0796L76.5604 51.7596ZM48.0004 62.3996C40.0804 62.3996 33.6004 55.9196 33.6004 47.9996C33.6004 40.0796 40.0804 33.5996 48.0004 33.5996C55.9204 33.5996 62.4004 40.0796 62.4004 47.9996C62.4004 55.9196 55.9204 62.3996 48.0004 62.3996Z" fill="#A855F7"/>
        </svg>
      )
    },
    {
      title: "HR/Support",
      description: "Set up smart FAQs, automate internal communications",
      bgColor: "rgba(71, 154, 255, 0.10)",
      iconColor: "#479AFF",
      icon: (
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M88 35.92V72C88 76.4 84.4 80 80 80H16C11.6 80 8 76.4 8 72V24C8 19.6 11.6 16 16 16H56.4C56.16 17.28 56 18.64 56 20C56 25.92 58.6 31.16 62.68 34.84L48 44L16 24V32L48 52L69.2 38.72C71.36 39.52 73.6 40 76 40C80.52 40 84.64 38.44 88 35.92ZM64 20C64 26.64 69.36 32 76 32C82.64 32 88 26.64 88 20C88 13.36 82.64 8 76 8C69.36 8 64 13.36 64 20Z" fill="#479AFF"/>
        </svg>
      )
    }
  ];

  return (
    <section className="user-roles-section">
      <div className="user-roles-container">
        <h2 className="user-roles-title">User Roles & Use Cases</h2>
        
        <div className="user-roles-grid">
          {userRoles.map((role, index) => (
            <div key={index} className="user-role-card">
              <div 
                className="user-role-circle"
                style={{ backgroundColor: role.bgColor }}
              >
                <div className="user-role-icon">
                  {role.icon}
                </div>
              </div>
              <div className="user-role-content">
                <h3 className="user-role-title">{role.title}</h3>
                <p className="user-role-description">{role.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default UserRolesSection;
