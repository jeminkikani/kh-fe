import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Dropdown
} from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InventoryPage = () => {
  const [companyEntries, setCompanyEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompanyEntries();
  }, []);

  const fetchCompanyEntries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/add-company-stock/get-company-stock`
      );

      // Map data so `is_approved` drives status
      const mappedData = (response.data.companyStock || []).map((item) => ({
        ...item,
        status: item.is_approved ? "approved" : "pending"
      }));

      setCompanyEntries(mappedData);
    } catch (error) {
      console.error("Error fetching company entries:", error);
      toast.error("Failed to fetch company entries");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (entryId) => {
    try {
      setLoading(true);
      const entry = companyEntries.find((e) => e._id === entryId);
      if (!entry) {
        toast.error("Entry not found");
        return;
      }

      const approvalData = {
        add_by: entry._id,
        date: entry.date || moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        gold_24kt: entry.gold_24kt || 0,
        conversion_rate: entry.conversion_rate || 0,
        gold_18kt: entry.gold_18kt || 0,
        is_approved: true,
      };

      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/home-stock/add-home-stock`,
        approvalData
      );

      toast.success("Entry approved successfully!");

      setCompanyEntries((prev) =>
        prev.map((e) =>
          e._id === entryId
            ? { ...e, status: "approved", is_approved: true }
            : e
        )
      );
    } catch (error) {
      console.error("Error approving entry:", error);
      toast.error("Failed to approve entry");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (entryId) => {
    try {
      setLoading(true);
      setCompanyEntries((prev) =>
        prev.map((e) =>
          e._id === entryId ? { ...e, status: "rejected" } : e
        )
      );
      toast.info("Entry rejected successfully!");
    } catch (error) {
      console.error("Error rejecting entry:", error);
      toast.error("Failed to reject entry");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "warning", text: "Pending" },
      approved: { variant: "success", text: "Approved" },
      rejected: { variant: "danger", text: "Rejected" },
      follow_up: { variant: "info", text: "Follow Up" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`badge bg-${config.variant}`}>{config.text}</span>;
  };

  return (
    <Container fluid>
      <div className="mb-4">
        <h2 className="text-primary">
          <i className="fas fa-building me-2"></i>
          Company Stock Management
        </h2>
        <p className="text-muted">View and manage company stock entries</p>
      </div>

      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <i className="fas fa-list me-2"></i>
            Company Stock Entries
          </h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : companyEntries.length > 0 ? (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th width="20%">Company Name</th>
                  <th width="15%">Date</th>
                  <th width="15%">Gold 24kt</th>
                  <th width="15%">Conversion Rate</th>
                  <th width="15%">Gold 18kt</th>
                  <th width="10%">Status</th>
                  <th width="10%">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companyEntries.map((entry) => (
                  <tr key={entry._id}>
                    <td>
                      <strong>{entry.company_id?.company_name || "N/A"}</strong>
                    </td>
                    <td>
                      <strong>
                        {moment(entry.date).format("DD-MM-YYYY")}
                      </strong>
                    </td>
                    <td><strong>{entry.gold_24kt}</strong></td>
                    <td><strong>{entry.conversion_rate}</strong></td>
                    <td><strong>{entry.gold_18kt}</strong></td>
                    <td>{getStatusBadge(entry.status)}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="outline-info"
                          size="sm"
                          disabled={["approved", "rejected"].includes(entry.status)}
                        >
                          Actions
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => handleApprove(entry._id)}
                            disabled={entry.status === "approved"}
                          >
                            <i className="fas fa-check me-2"></i> Approve
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleReject(entry._id)}
                            disabled={entry.status === "rejected"}
                          >
                            <i className="fas fa-times me-2"></i> Reject
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center text-muted py-4">
              <i className="fas fa-building fa-3x mb-3"></i>
              <p>No company stock entries found</p>
            </div>
          )}
        </Card.Body>
      </Card>

      <Row className="mt-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-warning">
                {companyEntries.filter(
                  (entry) => entry.status === "pending"
                ).length}
              </h4>
              <p className="text-muted mb-0">Pending</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-success">
                {companyEntries.filter((entry) => entry.status === "approved").length}
              </h4>
              <p className="text-muted mb-0">Approved</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-danger">
                {companyEntries.filter((entry) => entry.status === "rejected").length}
              </h4>
              <p className="text-muted mb-0">Rejected</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-info">
                {companyEntries.filter((entry) => entry.status === "follow_up").length}
              </h4>
              <p className="text-muted mb-0">Follow Up</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InventoryPage;
