import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Alert, Spinner, Badge, Table } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

const CompanyDashboard = ({ companyId }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: moment().startOf('month').format('YYYY-MM-DD'),
    endDate: moment().endOf('month').format('YYYY-MM-DD')
  });
  const [isFiltered, setIsFiltered] = useState(false);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/dashboard/company/${companyId}`);
      console.log('Company dashboard response:', response.data);
      setDashboardData(response.data.data);
      
      // Company info is already in the dashboard response
      setCompanyInfo(response.data.data);
      
    } catch (error) {
      console.error('Error fetching company dashboard data:', error);
      setError('Failed to load company dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredData = async () => {
    try {
      setFilterLoading(true);
      setError('');
      
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/dashboard/filter`, {
        params: {
          start_date: dateRange.startDate,
          end_date: dateRange.endDate,
          company_id: companyId
        }
      });
      
      setFilteredData(response.data.data);
      setIsFiltered(true);
      
    } catch (error) {
      console.error('Error fetching filtered data:', error);
      setError('Failed to load filtered data');
    } finally {
      setFilterLoading(false);
    }
  };

  const clearFilter = () => {
    setFilteredData(null);
    setIsFiltered(false);
    setDateRange({
      startDate: moment().startOf('month').format('YYYY-MM-DD'),
      endDate: moment().endOf('month').format('YYYY-MM-DD')
    });
  };

  useEffect(() => {
    if (companyId) {
      fetchCompanyData();
    }
  }, [companyId]);

  const currentData = isFiltered ? filteredData : dashboardData;

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3 text-muted">Loading company dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!currentData) {
    return (
      <Card className="shadow-sm">
        <Card.Body className="text-center py-5">
          <i className="fas fa-chart-bar fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">No Data Available</h5>
          <p className="text-muted">No dashboard data found for this company</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      {/* Company Info Header */}
      {companyInfo && (
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-info text-white">
            <h5 className="mb-0">
              <i className="fas fa-building me-2"></i>
              {companyInfo.company_name}
            </h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <strong>Phone:</strong> {companyInfo.company_phone}
              </Col>
              <Col md={4}>
                <strong>GST:</strong> {companyInfo.gst_number || 'N/A'}
              </Col>
              <Col md={4}>
                <strong>Address:</strong> {companyInfo.company_address}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Date Range Filter */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-light">
          <h6 className="mb-0">
            <i className="fas fa-filter me-2"></i>
            Date Range Filter
          </h6>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-end gap-2">
              <Button
                variant="primary"
                onClick={fetchFilteredData}
                disabled={filterLoading}
              >
                {filterLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Loading...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search me-1"></i>
                    Apply Filter
                  </>
                )}
              </Button>
              {isFiltered && (
                <Button variant="outline-secondary" onClick={clearFilter}>
                  <i className="fas fa-times me-1"></i>
                  Clear Filter
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Dashboard Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="dashboard-stats-card text-center">
            <Card.Body>
              <i className="fas fa-plus-circle text-success"></i>
              <h4 className="text-success">{currentData.total_added_24kt?.toFixed(2) || 0}</h4>
              <p>24K Added</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stats-card text-center">
            <Card.Body>
              <i className="fas fa-minus-circle text-danger"></i>
              <h4 className="text-danger">{currentData.total_sold_24kt?.toFixed(2) || 0}</h4>
              <p>24K Sold</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stats-card text-center">
            <Card.Body>
              <i className="fas fa-balance-scale text-warning"></i>
              <h4 className="text-warning">{currentData.current_stock_24kt?.toFixed(2) || 0}</h4>
              <p>Current 24K</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stats-card text-center">
            <Card.Body>
              <i className="fas fa-chart-line text-info"></i>
              <h4 className="text-info">{currentData.total_difference?.toFixed(2) || 0}</h4>
              <p>Total Difference</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Detailed Data Tables */}
      <Row>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white">
              <h6 className="mb-0">
                <i className="fas fa-chart-pie me-2"></i>
                24K Gold Summary
              </h6>
            </Card.Header>
            <Card.Body>
              <ul className="list-unstyled summary-list">
                <li><strong>Total Added:</strong> {currentData.total_added_24kt?.toFixed(2) || 0} g</li>
                <li><strong>Total Sold:</strong> {currentData.total_sold_24kt?.toFixed(2) || 0} g</li>
                <li><strong>Current Stock:</strong> {currentData.current_stock_24kt?.toFixed(2) || 0} g</li>
                <li><strong>Difference:</strong> {currentData.difference_24kt?.toFixed(2) || 0} g</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-info text-white">
              <h6 className="mb-0">
                <i className="fas fa-chart-pie me-2"></i>
                18K Gold Summary
              </h6>
            </Card.Header>
            <Card.Body>
              <ul className="list-unstyled summary-list">
                <li><strong>Total Added:</strong> {currentData.total_added_18kt?.toFixed(2) || 0} g</li>
                <li><strong>Total Sold:</strong> {currentData.total_sold_18kt?.toFixed(2) || 0} g</li>
                <li><strong>Current Stock:</strong> {currentData.current_stock_18kt?.toFixed(2) || 0} g</li>
                <li><strong>Difference:</strong> {currentData.difference_18kt?.toFixed(2) || 0} g</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Summary Information */}
      {isFiltered && (
        <Card className="shadow-sm mt-4">
          <Card.Header className="bg-light">
            <h6 className="mb-0">
              <i className="fas fa-info-circle me-2"></i>
              Filter Summary
            </h6>
          </Card.Header>
          <Card.Body>
            <p className="mb-0">
              <strong>Date Range:</strong> {moment(dateRange.startDate).format('DD-MM-YYYY')} to {moment(dateRange.endDate).format('DD-MM-YYYY')}
            </p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default CompanyDashboard; 