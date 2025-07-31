import React from "react";
import "../../styles/WhoUsesSection.css";

function WhoUsesSection() {
  const organizationTypes = [
    {
      title: "Enterprises & Corporates",
      bgColor: "#FAF2FE",
      users: [
        "Customer Support Teams - to quickly retrieve policies, SOPs, or troubleshooting answers",
        "Sales Teams: Access sales decks, product specs, or client data on the go.",
        "HR & People Teams: Handle internal queries, onboarding documents, or employee FAQs.",
        "Operations Managers: Standardize internal knowledge and compliance protocols.",
        "IT Departments: Maintain internal knowledge bases, integrate ticketing, and manage asset FAQs."
      ]
    },
    {
      title: "Development Organizations/NGOs",
      bgColor: "#E8F9FF",
      users: [
        "Program Managers - to streamline knowledge sharing across projects or countries",
        "Field Officers - who need real-time access to guidelines, manuals, or case data",
        "Monitoring & Evaluation Teams - to centralize reports, indicators, and templates",
        "Partner Networks - to provide consistent information externally via a knowledge hub"
      ]
    },
    {
      title: "Learning Institutions & Research Bodies",
      bgColor: "#E3FCFC",
      users: [
        "Faculty & Lecturers - to organize research materials, guides, and syllabi",
        "Students - for quick access to learning resources or course-related queries",
        "Librarians/Knowledge Officers - to digitize and serve internal collections"
      ]
    },
    {
      title: "Healthcare Providers & Institutions",
      bgColor: "#FDE1C3",
      users: [
        "Medical Staff - to reference protocols, dosages, or emergency procedures",
        "Admin Teams - for quick answers to insurance, compliance, or procedural questions",
        "Training Coordinators - for standardized onboarding and skills refreshers"
      ]
    },
    {
      title: "Government Institutions",
      bgColor: "#E8F9FF",
      users: [
        "Public Service Departments – to store and access policies, forms, and citizen service guidelines",
        "Compliance & Audit Teams – for managing laws, regulatory documents, and audit records",
        "County/Regional Offices – to ensure consistent communication and decentralized document access",
        "Legislative & Legal Units – to reference bills, amendments, legal templates, and archives"
      ]
    },
    {
      title: "Technology Providers / BPOs",
      bgColor: "#EAF2FC",
      users: [
        "Support Agents - to resolve tickets faster with embedded knowledge assistance",
        "Product Teams - to manage FAQs, updates, and documentation"
      ]
    }
  ];

  return (
    <section className="who-uses-section">
      <div className="who-uses-container">
        <h2 className="who-uses-title">Who Uses Vala AI</h2>
        
        <div className="organization-types-grid">
          {organizationTypes.map((org, index) => (
            <div 
              key={index} 
              className="organization-card"
              style={{ backgroundColor: org.bgColor }}
            >
              <h3 className="organization-title">{org.title}</h3>
              <ul className="organization-users">
                {org.users.map((user, userIndex) => (
                  <li key={userIndex} className="organization-user">
                    <svg className="check-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.3547 8.84301L11.6663 16.5313L7.47801 12.3547L5.83301 13.9997L11.6663 19.833L20.9997 10.4997L19.3547 8.84301ZM13.9997 2.33301C7.55967 2.33301 2.33301 7.55967 2.33301 13.9997C2.33301 20.4397 7.55967 25.6663 13.9997 25.6663C20.4397 25.6663 25.6663 20.4397 25.6663 13.9997C25.6663 7.55967 20.4397 2.33301 13.9997 2.33301ZM13.9997 23.333C8.84301 23.333 4.66634 19.1563 4.66634 13.9997C4.66634 8.84301 8.84301 4.66634 13.9997 4.66634C19.1563 4.66634 23.333 8.84301 23.333 13.9997C23.333 19.1563 19.1563 23.333 13.9997 23.333Z" fill="#323232"/>
                    </svg>
                    <span>{user}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhoUsesSection;
