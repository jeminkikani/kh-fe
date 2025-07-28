import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import CompanyForm from './CompanyForm';
import CompanyList from './CompanyList';

const CompanyPage = () => {
  const [editingCompany, setEditingCompany] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCompanySubmit = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="fas fa-building me-2 text-primary"></i>
            Company Management
          </h2>
          <p className="text-muted mb-0">Manage your business partners and companies</p>
        </div>
      </div>

      <Row>
        <Col lg={4}>
          <CompanyForm 
            onSubmit={handleCompanySubmit}
            editingCompany={editingCompany}
            setEditingCompany={setEditingCompany}
          />
        </Col>
        <Col lg={8}>
          <CompanyList 
            onEdit={handleEdit}
            refreshTrigger={refreshTrigger}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CompanyPage; 