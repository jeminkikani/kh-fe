// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import StockForm from "./components/StockForm";
import StockList from "./components/StockList";
import StockDashboard from "./components/StockDashBoard";
import Sidebar from "./components/Sidebar";
import ShopPage from "./components/ShopPage";
import CompanyPage from "./components/CompanyPage";
import AddCompanyStock from "./components/AddCompanyStock";
import SaleCompanyStock from "./components/SaleCompanyStock";
import Dashboard from "./components/Dashboard";
import InventoryPage from "./components/InventoryPage";
import AddInventoryPage from "./components/AddInventoryPage";

function App() {
  const [stocks, setStocks] = useState([]);
  const [editingStock, setEditingStock] = useState(null);
  const [lastClosingStock, setLastClosingStock] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchStocks = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/stocks/get-stock`);
      setStocks(res.data.data);

      const sortedStocks = [...res.data.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      if (sortedStocks.length > 0) {
        setLastClosingStock(sortedStocks[0].closing_stock);
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  useEffect(() => {
    fetchStocks();

    // Set up interval for clock
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up interval on unmount
    return () => clearInterval(timer);
  }, []);

  const addStock = async (data) => {
    await axios.post(`${process.env.REACT_APP_BASE_URL}/api/stocks/add-stock`, data);
    fetchStocks();
  };

  const deleteStock = async (id) => {
    await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/stocks/delete-stock/${id}`);
    fetchStocks();
  };

  const updateStock = async (id, data) => {
    await axios.put(
      `${process.env.REACT_APP_BASE_URL}/api/stocks/update-stock/${id}`,
      data
    );
    setEditingStock(null);
    fetchStocks();
  };

  // Format time as "03:31:45 PM"
  const formatTime = (date) => {
    return moment(date).format("hh:mm:ss A");
  };

  // Format date as "24-07-2025"
  const formatDate = (date) => {
    return moment(date).format("DD-MM-YYYY");
  };

  return (
    <Router>
      <div className="d-flex">
        <Sidebar />

        <div className="flex-grow-1">
          <Navbar bg="light" expand="lg" className="mb-4 shadow-sm">
            <Container fluid>
              <Navbar.Brand href="#">
                <i className="fas fa-store me-2"></i>
                Stock Management System
              </Navbar.Brand>
              <div className="ms-auto d-flex flex-column align-items-center me-4">
                <div className="fs-5">{formatTime(currentTime)}</div>
                <div className="text-muted small">
                  {formatDate(currentTime)}
                </div>
              </div>
            </Container>
          </Navbar>

          <Container fluid>
            <Routes>
              <Route path="/" element={<StockDashboard stocks={stocks} />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/shops" element={<ShopPage />} />
              <Route path="/companies" element={<CompanyPage />} />
              <Route path="/add-company-stock" element={<AddCompanyStock />} />
              <Route
                path="/sale-company-stock"
                element={<SaleCompanyStock />}
              />
              <Route path="/stocks-management" element={<InventoryPage />} />
              <Route
                path="/stocks"
                element={
                  <>
                    <h1 className="text-center mb-4">Add To Sale</h1>
                    <StockForm
                      onSubmit={
                        editingStock
                          ? (data) => updateStock(editingStock._id, data)
                          : addStock
                      }
                      editingStock={editingStock}
                      setEditingStock={setEditingStock}
                      lastClosingStock={lastClosingStock}
                    />
                    <StockList
                      stocks={stocks}
                      onEdit={setEditingStock}
                      onDelete={deleteStock}
                    />
                  </>
                }
              />
              <Route path="/new" element={<AddInventoryPage />} />
            </Routes>
          </Container>
        </div>
      </div>
    </Router>
  );
}

export default App;
