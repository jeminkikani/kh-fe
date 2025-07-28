import React, { useEffect, useState } from "react";
import { Table, Button, Row, Col, Form } from "react-bootstrap";

function StockList({ stocks, onEdit, onDelete }) {
  const [filteredStocks, setFilteredStocks] = useState(stocks);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [shopFilter, setShopFilter] = useState("");

  // Calculate total Sale Quantity
  const totalSaleQty = filteredStocks.reduce(
    (total, stock) => total + (Number(stock.sale_Qty) || 0),
    0
  );

  useEffect(() => {
    setFilteredStocks(stocks);
  }, [stocks]);

  const handleFilter = () => {
    let result = [...stocks];
    if (startDate && endDate) {
      result = result.filter((stock) => {
        const stockDate = new Date(stock.date).toISOString().split("T")[0];
        return stockDate >= startDate && stockDate <= endDate;
      });
    }
    if (shopFilter) {
      result = result.filter((stock) =>
        stock.shop_name.toLowerCase().includes(shopFilter.toLowerCase())
      );
    }
    setFilteredStocks(result);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setShopFilter("");
    setFilteredStocks(stocks);
  };

  return (
    <>
      <Row className="mb-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Shop Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Filter by shop name"
              value={shopFilter}
              onChange={(e) => setShopFilter(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3} className="d-flex align-items-end">
          <Button variant="primary" className="me-2" onClick={handleFilter}>
            Filter
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover responsive className="shadow">
        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>Shop Name</th>
            <th>Opening</th>
            <th>Sold By</th>
            <th>Sale Qty</th>
            <th>Closing</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStocks.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No records found
              </td>
            </tr>
          ) : (
            filteredStocks.map((stock) => (
              <tr key={stock._id}>
                <td>{new Date(stock.date).toLocaleDateString()}</td>
                <td value={'KHODAL'}>{stock.shop_name}</td>
                <td>{stock.opening_stock.toFixed(3)}</td>
                <td>
                  {stock.sold_by_info ? stock.sold_by_info.shop_name : ""}
                </td>
                <td>{stock.sale_Qty.toFixed(3)}</td>
                <td>{stock.closing_stock.toFixed(3)}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => onEdit(stock)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      if (window.confirm("Delete?")) onDelete(stock._id);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
          <tr style={{ backgroundColor: "#d4edda", fontWeight: "bold" }}>
            <td colSpan="4" className="text-end">
              Total
            </td>
            <td>{totalSaleQty}</td>
            <td colSpan="2"></td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}

export default StockList;
