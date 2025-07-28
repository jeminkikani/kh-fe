import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Alert, Spinner, Badge, Table } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

const AllCompaniesDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: moment().startOf('month').format('YYYY-MM-DD'),
    endDate: moment().endOf('month').format('YYYY-MM-DD')
  });
  const [isFiltered, setIsFiltered] = useState(false);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:5000/api/dashboard');
      console.log('Dashboard response:', response.data);
      setDashboardData(response.data.data);
      
    } catch (error) {
      console.error('Error fetching all companies dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredData = async () => {
    try {
      setFilterLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:5000/api/dashboard/filter', {
        params: {
          start_date: dateRange.startDate,
          end_date: dateRange.endDate
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
    fetchAllData();
  }, []);

  const currentData = isFiltered ? filteredData : dashboardData;

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3 text-muted">Loading dashboard data...</p>
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
          <p className="text-muted">No dashboard data found</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
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

      {/* Overall Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="dashboard-stats-card text-center">
            <Card.Body>
              <i className="fas fa-building text-primary"></i>
              <h4 className="text-primary">{currentData.summary?.total_companies || 0}</h4>
              <p>Total Companies</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stats-card text-center">
            <Card.Body>
              <i className="fas fa-plus-circle text-success"></i>
              <h4 className="text-success">{currentData.summary?.total_added_24kt?.toFixed(4) || 0}</h4>
              <p>Total 24K Added</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stats-card text-center">
            <Card.Body>
              <i className="fas fa-minus-circle text-danger"></i>
              <h4 className="text-danger">{currentData.summary?.total_sold_24kt?.toFixed(4) || 0}</h4>
              <p>Total 24K Sold</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stats-card text-center">
            <Card.Body>
              <i className="fas fa-balance-scale text-warning"></i>
              <h4 className="text-warning">{currentData.summary?.total_current_stock_24kt?.toFixed(4) || 0}</h4>
              <p>Total Current 24K</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Company-wise Summary */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-info text-white">
          <h6 className="mb-0">
            <i className="fas fa-list me-2"></i>
            Company-wise Summary
          </h6>
        </Card.Header>
        <Card.Body>
          {currentData.companies && currentData.companies.length > 0 ? (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>24K Added</th>
                    <th>24K Sold</th>
                    <th>Current 24K</th>
                    <th>18K Added</th>
                    <th>18K Sold</th>
                    <th>Current 18K</th>
                    <th>Total Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.companies.map((company, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{company.company_name}</strong>
                        <br />
                        <small className="text-muted">{company.company_phone}</small>
                      </td>
                      <td>
                        <Badge bg="success">{company.total_added_24kt?.toFixed(4) || 0}</Badge>
                      </td>
                      <td>
                        <Badge bg="danger">{company.total_sold_24kt?.toFixed(4) || 0}</Badge>
                      </td>
                      <td>
                        <Badge bg="warning">{company.current_stock_24kt?.toFixed(4) || 0}</Badge>
                      </td>
                      <td>
                        <Badge bg="info">{company.total_added_18kt?.toFixed(4) || 0}</Badge>
                      </td>
                      <td>
                        <Badge bg="danger">{company.total_sold_18kt?.toFixed(4) || 0}</Badge>
                      </td>
                      <td>
                        <Badge bg="warning">{company.current_stock_18kt?.toFixed(4) || 0}</Badge>
                      </td>
                      <td>
                        <Badge bg="primary">{company.total_difference?.toFixed(4) || 0}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p className="text-muted text-center">No company summary data available</p>
          )}
        </Card.Body>
      </Card>

      {/* Recent Transactions */}
      <Card className="shadow-sm">
        <Card.Header className="bg-secondary text-white">
          <h6 className="mb-0">
            <i className="fas fa-chart-pie me-2"></i>
            Summary Statistics
          </h6>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h6 className="text-primary">24K Gold Summary</h6>
              <ul className="list-unstyled summary-list">
                <li><strong>Total Added:</strong> {currentData.summary?.total_added_24kt?.toFixed(4) || 0} g</li>
                <li><strong>Total Sold:</strong> {currentData.summary?.total_sold_24kt?.toFixed(4) || 0} g</li>
                <li><strong>Current Stock:</strong> {currentData.summary?.total_current_stock_24kt?.toFixed(4) || 0} g</li>
                <li><strong>Difference:</strong> {currentData.summary?.total_difference_24kt?.toFixed(4) || 0} g</li>
              </ul>
            </Col>
            <Col md={6}>
              <h6 className="text-info">18K Gold Summary</h6>
              <ul className="list-unstyled summary-list">
                <li><strong>Total Added:</strong> {currentData.summary?.total_added_18kt?.toFixed(4) || 0} g</li>
                <li><strong>Total Sold:</strong> {currentData.summary?.total_sold_18kt?.toFixed(4) || 0} g</li>
                <li><strong>Current Stock:</strong> {currentData.summary?.total_current_stock_18kt?.toFixed(4) || 0} g</li>
                <li><strong>Difference:</strong> {currentData.summary?.total_difference_18kt?.toFixed(4) || 0} g</li>
              </ul>
            </Col>
          </Row>
          <hr />
          <div className="grand-total">
            <h5>
              Grand Total Difference: {currentData.summary?.grand_total_difference?.toFixed(4) || 0} g
            </h5>
          </div>
        </Card.Body>
      </Card>

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

export default AllCompaniesDashboard; 