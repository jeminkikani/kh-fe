import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";

const INITIAL_ROW = {
    opening_stock_18kt: "",
    opening_stock_24kt: "",
    sold_by: "",
    sale_Qty: "",
    closing_stock_18kt: "",
    closing_stock_24kt: "",
    conversion_rate: "",
};

function AddInventoryForm({ onSubmit, editingItem, setEditingItem }) {
  const [date, setDate] = useState("");
  const [rows, setRows] = useState([{ ...INITIAL_ROW }]);
  const [shops, setShops] = useState([]); // Save the shop list

  // Fetch shops list
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/shops/get-shops`)
      .then((res) => setShops(res.data.data))
      .catch((err) => {
        setShops([]);
        console.error("Failed to load shops", err);
      });
  }, []);

  useEffect(() => {
    if (editingItem) {
      setDate(editingItem.date ? editingItem.date.slice(0, 10) : "");
      setRows([
        {
          opening_stock_18kt: editingItem.opening_stock_18kt,
          opening_stock_24kt: editingItem.opening_stock_24kt,
          sold_by: editingItem.sold_by,
          sale_Qty: editingItem.sale_Qty,
          closing_stock_18kt: editingItem.closing_stock_18kt,
          closing_stock_24kt: editingItem.closing_stock_24kt,
          conversion_rate: editingItem.conversion_rate,
        },
      ]);
    } else {
      setDate("");
      setRows([{ ...INITIAL_ROW }]);
    }
  }, [editingItem]);

  const handleRowChange = (index, e) => {
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      [e.target.name]: e.target.value,
    };

    // Auto calculate closing stock
    if (e.target.name === "opening_stock" || e.target.name === "purchase_qty") {
      updatedRows[index].closing_stock = (
        Number(updatedRows[index].opening_stock || 0) +
        Number(updatedRows[index].purchase_qty || 0)
      ).toFixed(3);
    }

    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { ...INITIAL_ROW }]);
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

    if (!date || rows.some(row => !row.opening_stock_18kt || !row.opening_stock_24kt || !row.sold_by || !row.sale_Qty || !row.closing_stock_18kt || !row.closing_stock_24kt || !row.conversion_rate)) {
      alert("Please fill all required fields.");
      return;
    }

    rows.forEach((row) => {
      onSubmit({ date, ...row });
    });

    setDate("");
    setRows([{ ...INITIAL_ROW }]);
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
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {rows.map((row, index) => (
            <div key={index} className="mb-3 border p-3">
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-2">
                    <Form.Label>Opening Stock 18KT</Form.Label>
                    <Form.Control
                      name="opening_stock_18kt"
                      value={row.opening_stock_18kt}
                      onChange={(e) => handleRowChange(index, e)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label>Opening Stock 24KT</Form.Label>
                    <Form.Control
                      name="opening_stock_24kt"
                      value={row.opening_stock_24kt}
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
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label>Closing Stock 18KT</Form.Label>
                    <Form.Control
                      name="closing_stock_18kt"
                      value={row.closing_stock_18kt}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label>Closing Stock 24KT</Form.Label>
                    <Form.Control
                      name="closing_stock_24kt"
                      value={row.closing_stock_24kt}
                      readOnly
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
                variant={editingItem ? "warning" : "success"}
                type="submit"
                className="w-100"
              >
                {editingItem ? "Update" : "Save All"} Inventory
              </Button>
            </Col>
          </Row>

          {editingItem && (
            <div className="mt-2 text-center">
              <Button
                variant="secondary"
                onClick={() => setEditingItem(null)}
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

export default AddInventoryForm;
