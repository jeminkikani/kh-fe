import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert, Row, Col } from "react-bootstrap";
import { companyServices } from "../services/CompanyServices";

const CompanyForm = ({ onSubmit, editingCompany, setEditingCompany }) => {
  const [formData, setFormData] = useState({
    company_name: "",
    company_address: "",
    company_phone: "",
    gst_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (editingCompany) {
      setFormData({
        company_name: editingCompany.company_name || "",
        company_address: editingCompany.company_address || "",
        company_phone: editingCompany.company_phone || "",
        gst_number: editingCompany.gst_number || "",
      });
    }
  }, [editingCompany]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (editingCompany) {
        await companyServices.updateCompany(editingCompany._id, formData);
        setSuccess("Company updated successfully!");
      } else {
        await companyServices.addCompany(formData);
        setSuccess("Company added successfully!");
      }

      setFormData({
        company_name: "",
        company_address: "",
        company_phone: "",
        gst_number: "",
      });

      if (onSubmit) {
        onSubmit();
      }

      if (editingCompany && setEditingCompany) {
        setEditingCompany(null);
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      company_name: "",
      company_address: "",
      company_phone: "",
      gst_number: "",
    });
    if (setEditingCompany) {
      setEditingCompany(null);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">
          <i className="fas fa-building me-2"></i>
          {editingCompany ? "Edit Company" : "Add New Company"}
        </h5>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Company Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter company name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number *</Form.Label>
                <Form.Control
                  type="tel"
                  name="company_phone"
                  value={formData.company_phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter phone number"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="company_address"
                  value={formData.company_address}
                  onChange={handleChange}
                  required
                  placeholder="Enter company address"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>GST Number</Form.Label>
                <Form.Control
                  type="text"
                  name="gst_number"
                  value={formData.gst_number}
                  onChange={handleChange}
                  placeholder="Enter GST number (optional)"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="px-4"
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {editingCompany ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  <i
                    className={`fas ${
                      editingCompany ? "fa-save" : "fa-plus"
                    } me-2`}
                  ></i>
                  {editingCompany ? "Update Company" : "Add Company"}
                </>
              )}
            </Button>

            {editingCompany && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                className="px-4"
              >
                <i className="fas fa-times me-2"></i>
                Cancel
              </Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CompanyForm;
