import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Alert, Spinner, Badge, Table } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import CompanyDashboard from './CompanyDashboard';
import AllCompaniesDashboard from './AllCompaniesDashboard';
import './Dashboard.css';

const Dashboard = () => {
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'company'
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/companies/get-companies');
      setCompanies(response.data.companies || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError('Failed to load companies');
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleViewChange = (mode) => {
    setViewMode(mode);
    if (mode === 'all') {
      setSelectedCompany('');
    }
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="fas fa-chart-line me-2"></i>
                  Gold Stock Dashboard
                </h4>
                <div className="d-flex gap-2">
                  <Button
                    variant={viewMode === 'all' ? 'light' : 'outline-light'}
                    onClick={() => handleViewChange('all')}
                    size="sm"
                  >
                    <i className="fas fa-globe me-1"></i>
                    All Companies
                  </Button>
                  <Button
                    variant={viewMode === 'company' ? 'light' : 'outline-light'}
                    onClick={() => handleViewChange('company')}
                    size="sm"
                  >
                    <i className="fas fa-building me-1"></i>
                    Company Specific
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {viewMode === 'company' && (
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Select Company</Form.Label>
                      <Form.Select
                        value={selectedCompany}
                        onChange={(e) => setSelectedCompany(e.target.value)}
                        required
                      >
                        <option value="">Choose a company...</option>
                        {companies.map(company => (
                          <option key={company._id} value={company._id}>
                            {company.company_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="row">
        <div className="col-12">
          {error && <Alert variant="danger">{error}</Alert>}
          
          {viewMode === 'all' ? (
            <AllCompaniesDashboard />
          ) : (
            selectedCompany ? (
              <CompanyDashboard companyId={selectedCompany} />
            ) : (
              <Card className="shadow-sm">
                <Card.Body className="text-center py-5">
                  <i className="fas fa-building fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Select a Company</h5>
                  <p className="text-muted">Choose a company from the dropdown above to view its specific dashboard</p>
                </Card.Body>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 