import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";

const INITIAL_ROW = {
  opening_stock_18kt: "",
  opening_stock_24kt: "",
  sold_by: "",
  sale_Qty: "",
  closing_stock_18kt: "",
  closing_stock_24kt: "",
  conversion_rate: "",
};

function StockForm({
  onSubmit,
  editingStock,
  setEditingStock,
  lastClosingStock,
}) {
  const [date, setDate] = useState("");
  const [rows, setRows] = useState([
    { ...INITIAL_ROW, opening_stock_18kt: lastClosingStock || "" },
  ]);
  const [shops, setShops] = useState([]); // Save the shop list

  // Fetch shops list
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/shops/get-shops")
      .then((res) => setShops(res.data.data))
      .catch((err) => {
        setShops([]);
        console.error("Failed to load shops", err);
      });
  }, []);

  useEffect(() => {
    if (editingStock) {
      setDate(editingStock.date ? editingStock.date.slice(0, 10) : "");
      setRows([
        {
          shop_name: editingStock.shop_name,
          opening_stock_18kt: editingStock.opening_stock_18kt,
          opening_stock_24kt: editingStock.opening_stock_24kt,
          sold_by: editingStock.sold_by,
          sale_Qty: editingStock.sale_Qty,
          closing_stock_18kt: editingStock.closing_stock_18kt,
          closing_stock_24kt: editingStock.closing_stock_24kt,
          conversion_rate: editingStock.conversion_rate,
        },
      ]);
    } else {
      setDate("");
      setRows([{ ...INITIAL_ROW, opening_stock_18kt: lastClosingStock || "" }]);
    }
  }, [editingStock, lastClosingStock]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleRowChange = (index, e) => {
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      [e.target.name]: e.target.value,
    };

    // Calculate closing stock if opening_stock or sale_Qty changes
    if (
      e.target.name === "opening_stock_18kt" ||
      e.target.name === "sale_Qty"
    ) {
      updatedRows[index].closing_stock_18kt = (
        Number(updatedRows[index].opening_stock_18kt || 0) -
        Number(updatedRows[index].sale_Qty || 0)
      ).toFixed(3);
    }

    // Calculate closing stock 24kt based on conversion rate
    if (
      e.target.name === "opening_stock_18kt" ||
      e.target.name === "opening_stock_24kt" ||
      e.target.name === "sale_Qty" ||
      e.target.name === "conversion_rate"
    ) {
      const closingStock18kt = Number(
        updatedRows[index].closing_stock_18kt || 0
      );
      const openingStock24kt = Number(
        updatedRows[index].opening_stock_24kt || 0
      );
      const conversionRate = Number(updatedRows[index].conversion_rate || 0);

      if (conversionRate > 0) {
        // Calculate closing stock 24kt: opening_stock_24kt - (sale_Qty / conversion_rate)
        const saleQty24kt =
          Number(updatedRows[index].sale_Qty || 0) / conversionRate;
        updatedRows[index].closing_stock_24kt = (
          openingStock24kt - saleQty24kt
        ).toFixed(3);
      } else {
        updatedRows[index].closing_stock_24kt = "";
      }
    }

    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        ...INITIAL_ROW,
        opening_stock_18kt:
          rows[rows.length - 1]?.closing_stock_18kt || lastClosingStock || "",
      },
    ]);
  };

  const removeRow = (index) => {
    if (rows.length > 1) {
      const updatedRows = [...rows];
      updatedRows.splice(index, 1);
      setRows(updatedRows);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all rows
    if (
      !date ||
      rows.some(
        (row) =>
          !row.opening_stock_18kt ||
          !row.opening_stock_24kt ||
          !row.sold_by ||
          !row.sale_Qty ||
          !row.conversion_rate
      )
    ) {
      alert("Please fill all required fields.");
      return;
    }

    // Submit each row as a separate entry with the same date
    rows.forEach((row) => {
      onSubmit({
        date,
        ...row,
      });
    });

    // Reset form
    setDate("");
    setRows([
      {
        ...INITIAL_ROW,
        opening_stock_18kt:
          rows[rows.length - 1]?.closing_stock_18kt || lastClosingStock || "",
      },
    ]);
  };

  return (
    <Card className="mb-4 shadow">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-2">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {rows.map((row, index) => (
            <div key={index} className="mb-3 border p-3">
              <Row>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label>Opening Stock (18kt)</Form.Label>
                    <Form.Control
                      name="opening_stock_18kt"
                      value={row.opening_stock_18kt}
                      type="number"
                      step="0.001"
                      onChange={(e) => handleRowChange(index, e)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label>Opening Stock (24kt)</Form.Label>
                    <Form.Control
                      name="opening_stock_24kt"
                      value={row.opening_stock_24kt}
                      type="number"
                      step="0.001"
                      onChange={(e) => handleRowChange(index, e)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label>Sold By</Form.Label>
                    <Form.Control
                      name="sold_by"
                      as="select"
                      value={row.sold_by}
                      onChange={(e) => handleRowChange(index, e)}
                      required
                    >
                      <option value="">Select shop</option>
                      {shops.map((shop) => (
                        <option key={shop._id} value={shop._id}>
                          {shop.shop_name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label>Sale Qty</Form.Label>
                    <Form.Control
                      name="sale_Qty"
                      value={row.sale_Qty}
                      onChange={(e) => handleRowChange(index, e)}
                      type="number"
                      step="0.001"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label>Conversion Rate</Form.Label>
                    <Form.Control
                      name="conversion_rate"
                      value={row.conversion_rate}
                      onChange={(e) => handleRowChange(index, e)}
                      type="number"
                      step="0.001"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label>Closing Stock (18kt)</Form.Label>
                    <Form.Control
                      name="closing_stock_18kt"
                      value={row.closing_stock_18kt}
                      readOnly
                      type="number"
                      step="0.001"
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label>Closing Stock (24kt)</Form.Label>
                    <Form.Control
                      name="closing_stock_24kt"
                      value={row.closing_stock_24kt}
                      readOnly
                      type="number"
                      step="0.001"
                    />
                  </Form.Group>
                </Col>
                <Col md={1} className="d-flex align-items-end">
                  {rows.length > 1 && (
                    <Button
                      variant="danger"
                      onClick={() => removeRow(index)}
                      className="w-100"
                    >
                      ×
                    </Button>
                  )}
                </Col>
              </Row>
            </div>
          ))}

          <Row>
            <Col md={2}>
              <Button variant="primary" onClick={addRow} className="w-100 mb-2">
                Add Row (+)
              </Button>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button
                variant={editingStock ? "warning" : "success"}
                type="submit"
                className="w-100"
              >
                {editingStock ? "Update" : "Save All"} Stock
              </Button>
            </Col>
          </Row>

          {editingStock && (
            <div className="mt-2 text-center">
              <Button
                variant="secondary"
                onClick={() => setEditingStock(null)}
                size="sm"
              >
                Cancel Edit
              </Button>
            </div>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
}

export default StockForm;
