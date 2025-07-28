import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  Row,
  Col,
  Table,
  Badge,
  Spinner,
  Modal,
} from "react-bootstrap";
import {
  companyServices,
  addCompanyStockServices,
} from "../services/CompanyServices";
import moment from "moment";

const AddCompanyStock = () => {
  const [formData, setFormData] = useState({
    company_id: "",
    date: moment().format("YYYY-MM-DD"),
    gold_18kt: "",
    conversion_rate: "",
    gold_24kt: "",
  });
  const [companies, setCompanies] = useState([]);
  const [stockEntries, setStockEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filterDate, setFilterDate] = useState("");

  const fetchCompanies = async () => {
    try {
      const response = await companyServices.getCompanies();
      setCompanies(response.companies || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchStockEntries = async () => {
    try {
      setFetching(true);
      const response = await addCompanyStockServices.getAddStocks();
      setStockEntries(response.companyStock || []);
    } catch (error) {
      console.error("Error fetching stock entries:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchStockEntries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-calculate gold_24kt when gold_18kt or conversion_rate changes
    if (name === "gold_18kt" || name === "conversion_rate") {
      const gold18kt =
        name === "gold_18kt"? parseFloat(value) : parseFloat(formData.gold_18kt);
      const rate =
        name === "conversion_rate" ? parseFloat(value) : parseFloat(formData.conversion_rate);

      if (!isNaN(gold18kt) && !isNaN(rate) && rate > 0) {
        const gold24kt = gold18kt * rate;
        setFormData((prev) => ({
          ...prev,
          gold_24kt: gold24kt.toFixed(4),
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await addCompanyStockServices.addStock(formData);
      setSuccess("Stock entry added successfully!");

      setFormData({
        company_id: "",
        date: moment().format("YYYY-MM-DD"),
        gold_18kt: "",
        conversion_rate: "",
        gold_24kt: "",
      });

      fetchStockEntries();
      setShowModal(false);
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this stock entry?")) {
      try {
        await addCompanyStockServices.deleteStock(id);
        setSuccess("Stock entry deleted successfully!");
        fetchStockEntries();
      } catch (error) {
        setError("Failed to delete stock entry");
      }
    }
  };

  const formatDate = (date) => {
    return moment(date).format("DD-MM-YYYY");
  };

  const getCompanyName = (companyId) => {
    const company = companies.find((c) => c._id === companyId);
    return company ? company.company_name : "Unknown Company";
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFormData({
      company_id: "",
      date: moment().format("YYYY-MM-DD"),
      gold_18kt: "",
      conversion_rate: "",
      gold_24kt: "",
    });
    setError("");
    setSuccess("");
  };

  const handleModalShow = () => {
    setShowModal(true);
  };

  const filteredEntries = filterDate 
    ? stockEntries.filter(entry => 
        moment(entry.date).format('YYYY-MM-DD') === filterDate
      )
    : stockEntries;

    return (
    <div className="row">
      <div className="col-md-12">
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-success text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-plus-circle me-2"></i>
                Company Stock Management
              </h5>
              <div className="d-flex gap-2">
                <Button
                  variant="light"
                  onClick={handleModalShow}
                  size="sm"
                >
                  <i className="fas fa-plus me-1"></i>
                  Add New Stock
                </Button>
                <Form.Control
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  placeholder="Filter by date"
                  style={{ width: '150px' }}
                />
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            
            {fetching ? (
              <div className="text-center py-4">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="text-center py-4">
                <i className="fas fa-boxes fa-2x text-muted mb-3"></i>
                <p className="text-muted">
                  {filterDate ? `No stock entries found for ${moment(filterDate).format('DD-MM-YYYY')}` : 'No stock entries found'}
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Date</th>
                      <th>18K</th>
                      <th>24K</th>
                      <th>Conversion Rate</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.map((entry) => (
                      <tr key={entry._id}>
                        <td>
                          <strong>{getCompanyName(entry.company_id)}</strong>
                        </td>
                        <td>
                          <small>{formatDate(entry.date)}</small>
                        </td>
                        <td>
                          <Badge bg="info" className="text-dark">
                            {entry.gold_18kt}g
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="warning" className="text-dark">
                            {entry.gold_24kt}g
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="secondary">
                            {entry.conversion_rate}
                          </Badge>
                        </td>
                        <td>
                          {entry.is_cleared ? (
                            <Badge bg="success">Cleared</Badge>
                          ) : (
                            <Badge bg="warning">Pending</Badge>
                          )}
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(entry._id)}
                            title="Delete Entry"
                            className="btn-sm px-2"
                          >
                            <i className="fas fa-trash me-1"></i>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
                    </Card.Body>
        </Card>
      </div>

      {/* Add Stock Modal */}
      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-plus-circle me-2"></i>
            Add New Stock Entry
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Company *</Form.Label>
              <Form.Select
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.company_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gold 18K (grams) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="gold_18kt"
                    value={formData.gold_18kt}
                    onChange={handleChange}
                    required
                    placeholder="Enter 18kt gold weight"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Conversion Rate *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="conversion_rate"
                    value={formData.conversion_rate}
                    onChange={handleChange}
                    required
                    placeholder="Enter conversion rate"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gold 24K (grams) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="gold_24kt"
                    value={formData.gold_24kt}
                    onChange={handleChange}
                    required
                    placeholder="Auto-calculated"
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button 
                type="submit" 
                variant="success" 
                disabled={loading}
                className="flex-fill"
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Adding Stock...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus-circle me-2"></i>
                    Add Stock Entry
                  </>
                )}
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleModalClose}
                className="flex-fill"
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddCompanyStock;
