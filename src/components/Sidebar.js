// import React from 'react';
// import { Nav } from 'react-bootstrap';
// import { NavLink } from 'react-router-dom';

// // Custom active style for sidebar links
// const activeLinkStyle = {
//   background: 'linear-gradient(90deg, #3498db 0%, #6dd5fa 100%)',
//   color: '#fff',
//   borderRadius: '0.375rem',
//   fontWeight: 'bold'
// };

// const Sidebar = () => {
//   return (
//     <Nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse flex-column h-100 p-3" style={{ minHeight: '100vh' }}>
//       <div className="position-sticky pt-3">
//         <Nav.Item className="mb-2">
//           <Nav.Link
//             as={NavLink}
//             to="/"
//             end
//             style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
//           >
//             <i className="fas fa-tachometer-alt me-2"></i>
//             Dashboard
//           </Nav.Link>
//         </Nav.Item>
//         <Nav.Item className="mb-2">
//           <Nav.Link
//             as={NavLink}
//             to="/shops"
//             end
//             style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
//           >
//             <i className="fas fa-tachometer-alt me-2"></i>
//             Shops
//           </Nav.Link>
//         </Nav.Item>
//         <Nav.Item className="mb-2">
//           <Nav.Link
//             as={NavLink}
//             to="/stocks"
//             style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
//           >
//             <i className="fas fa-boxes me-2"></i>
//             Stock Management
//           </Nav.Link>
//         </Nav.Item>
//         <Nav.Item className="mb-2">
//           <Nav.Link
//             as={NavLink}
//             to="/reports"
//             style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
//           >
//             <i className="fas fa-chart-bar me-2"></i>
//             Reports
//           </Nav.Link>
//         </Nav.Item>
//       </div>
//     </Nav>
//   );
// };

// export default Sidebar;

import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

// Icons from Font Awesome (free version)
const ICONS = {
  dashboard: "fa-gauge-high",
  shops: "fa-store",
  stockManagement: "fa-warehouse",
  stockSale: "fa-cash-register",
  stockAdd: "fa-boxes-stacked",
  reports: "fa-chart-pie",
  settings: "fa-gear",
  users: "fa-users",
  products: "fa-tags",
};

const activeLinkStyle = {
  background: "linear-gradient(90deg, #3498db 0%, #6dd5fa 100%)",
  color: "#fff",
  borderRadius: "0.375rem",
  fontWeight: "bold",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

const hoverStyle = {
  transition: "all 0.3s ease",
  ":hover": {
    backgroundColor: "#f0f8ff",
    borderRadius: "0.375rem",
  },
};

// Sidebar links data with better organization
const NAV_LINKS = [
  {
    section: "Main",
    links: [
      { to: "/", text: "Home", icon: ICONS.dashboard, end: true },
      { to: "/dashboard", text: "Analytics Dashboard", icon: "fa-chart-line" },
    ],
  },
  {
    section: "Company Management",
    links: [
      { to: "/companies", text: "Companies", icon: "fa-building" },
      { to: "/add-company-stock", text: "Add Company Stock", icon: "fa-plus-circle" },
      { to: "/sale-company-stock", text: "Sale Company Stock", icon: "fa-minus-circle" },
    ],
  },
  {
    section: "Operations",
    links: [
      { to: "/shops", text: "Shops", icon: ICONS.shops },
      {
        to: "/stocks-management",
        text: "Inventory",
        icon: ICONS.stockManagement,
      },
      { to: "/stocks", text: "Sale Inventory", icon: ICONS.stockSale },
      { to: "/new", text: "Add Inventory", icon: ICONS.stockAdd },
    ],
  },
  {
    section: "Reports & Analytics",
    links: [
      { to: "/reports", text: "Sales Reports", icon: ICONS.reports },
      { to: "/analytics", text: "Performance", icon: ICONS.reports },
    ],
  },
  {
    section: "Administration",
    links: [
      { to: "/users", text: "User Management", icon: ICONS.users },
      { to: "/settings", text: "System Settings", icon: ICONS.settings },
    ],
  },
];

const Sidebar = () => {
  return (
    <Nav
      className="col-md-3 col-lg-2 d-md-block sidebar collapse flex-column h-100 p-3"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #ffffff 0%, #578abd 100%)",
        borderRight: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <div className="position-sticky pt-3">
        <div className="text-center mb-4">
          <h4 className="text-primary">
            <i className="fas fa-box-open me-2"></i>
            KHODAL GOLD
          </h4>
        </div>

        {NAV_LINKS.map((section) => (
          <div key={section.section} className="mb-4">
            <h6 className="sidebar-section-title ps-2 mb-2 text-uppercase text-muted small fw-bold">
              {section.section}
            </h6>
            {section.links.map((link) => (
              <Nav.Item key={link.to} className="mb-1">
                <Nav.Link
                  as={NavLink}
                  to={link.to}
                  end={link.end}
                  style={({ isActive }) =>
                    isActive ? activeLinkStyle : hoverStyle
                  }
                  className="py-2 px-3"
                >
                  <i className={`fas ${link.icon} me-2`}></i>
                  {link.text}
                </Nav.Link>
              </Nav.Item>
            ))}
          </div>
        ))}
      </div>
    </Nav>
  );
};

export default React.memo(Sidebar);
