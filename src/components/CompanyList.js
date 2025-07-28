import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Card,
  Badge,
  Modal,
  Alert,
  Spinner,
} from "react-bootstrap";
import { companyServices } from "../services/CompanyServices";
import moment from "moment";
import "./CompanyList.css";

const CompanyList = ({ onEdit, refreshTrigger }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyServices.getCompanies();
      console.log("Fetched companies:", response.companies);

      setCompanies(response.companies || []);
      setError("");
    } catch (error) {
      setError("Failed to fetch companies");
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [refreshTrigger]);

  const handleDelete = async () => {
    if (!companyToDelete) return;

    try {
      await companyServices.deleteCompany(companyToDelete._id);
      setCompanies((prev) =>
        prev.filter((company) => company._id !== companyToDelete._id)
      );
      setShowDeleteModal(false);
      setCompanyToDelete(null);
    } catch (error) {
      setError("Failed to delete company");
      console.error("Error deleting company:", error);
    }
  };

  const confirmDelete = (company) => {
    setCompanyToDelete(company);
    setShowDeleteModal(true);
  };

  const formatDate = (date) => {
    return moment(date).format("DD-MM-YYYY");
  };

  if (loading) {
    return (
      <Card className="shadow-sm">
        <Card.Body className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading companies...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="fas fa-building me-2"></i>
              Companies ({companies.length})
            </h5>
          </div>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {companies.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-building fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No companies found</h5>
              <p className="text-muted">
                Add your first company to get started
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ minWidth: "150px" }}>Company Name</th>
                    <th style={{ minWidth: "120px" }}>Phone</th>
                    <th style={{ minWidth: "200px" }}>Address</th>
                    <th style={{ minWidth: "120px" }}>GST Number</th>
                    <th style={{ minWidth: "100px" }}>Created Date</th>
                    <th style={{ minWidth: "80px" }}>Status</th>
                    <th style={{ minWidth: "180px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company._id}>
                      <td>
                        <strong>{company.company_name}</strong>
                      </td>
                      <td>
                        <i className="fas fa-phone me-1 text-muted"></i>
                        {company.company_phone}
                      </td>
                      <td>
                        <small className="text-muted">
                          {company.company_address.length > 50
                            ? `${company.company_address.substring(0, 50)}...`
                            : company.company_address}
                        </small>
                      </td>
                      <td>
                        {company.gst_number ? (
                          <Badge bg="info" className="text-dark">
                            {company.gst_number}
                          </Badge>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <small className="text-muted">
                          {formatDate(company.createdAt)}
                        </small>
                      </td>
                      <td>
                        {company.is_deleted ? (
                          <Badge bg="danger">Deleted</Badge>
                        ) : (
                          <Badge bg="success">Active</Badge>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2 align-items-center">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => onEdit(company)}
                            title="Edit Company"
                            className="btn-sm px-2"
                          >
                            <i className="fas fa-edit me-1"></i>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => confirmDelete(company)}
                            title="Delete Company"
                            disabled={company.is_deleted}
                            className="btn-sm px-2"
                          >
                            <i className="fas fa-trash me-1"></i>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the company "
          {companyToDelete?.company_name}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CompanyList;
