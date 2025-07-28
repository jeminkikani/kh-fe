import React from 'react';
import { Card, Row, Col, Container, ProgressBar } from 'react-bootstrap';

const StockDashboard = ({ stocks }) => {
    // Calculate totals
    const totalClosingStock = stocks.reduce((sum, stock) => sum + Number(stock.closing_stock || 0), 0);
    const totalSaleQty = stocks.reduce((total, stock) => total + (Number(stock.sale_Qty) || 0), 0);
    const totalOpeningStock = stocks.reduce((sum, stock) => sum + Number(stock.opening_stock || 0), 0);
    // Find the most recent stock entry based on date & time
    const latestStock = [...stocks].sort((a, b) => new Date(b.date) - new Date(a.date))[0]; // newest first


    // Calculate sales percentage
    const salesPercentage = totalOpeningStock > 0
        ? (totalSaleQty / totalOpeningStock) * 100
        : 0;

    // Get top 5 sales
    const topSales = [...stocks]
        .sort((a, b) => Number(b.sale_Qty) - Number(a.sale_Qty))
        .slice(0, 5);

    return (
        <Container fluid className="mt-4">
            <Row>
                {/* Main Dashboard Content (8 columns) */}
                <Col lg={8}>
                    <Row>
                        {/* Closing Stock Card */}
                        <Col md={6} className="mb-4">
                            <Card className="h-100 shadow border-success">
                                <Card.Body>
                                    <Card.Title className="text-success">
                                        <i className="fas fa-boxes me-2"></i>
                                        Total Closing Stock
                                    </Card.Title>
                                    <h2 className="mt-3">{totalClosingStock.toFixed(3)}</h2>
                                    <ProgressBar
                                        now={(totalClosingStock / (totalOpeningStock || 1)) * 100}
                                        variant="success"
                                        className="mt-2"
                                    />
                                    <small className="text-muted">Remaining inventory</small>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Sale Quantity Card */}
                        <Col md={6} className="mb-4">
                            <Card className="h-100 shadow border-primary">
                                <Card.Body>
                                    <Card.Title className="text-primary">
                                        <i className="fas fa-chart-line me-2"></i>
                                        Total Sales Quantity
                                    </Card.Title>
                                    <h2 className="mt-3">{totalSaleQty.toFixed(3)}</h2>
                                    <ProgressBar
                                        now={salesPercentage}
                                        variant="primary"
                                        className="mt-2"
                                    />
                                    <small className="text-muted">
                                        {salesPercentage.toFixed(1)}% of opening stock sold
                                    </small>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Recent Transactions Table */}
                        <Col md={12} className="mb-4">
                            <Card className="shadow">
                                <Card.Body>
                                    <Card.Title>
                                        <i className="fas fa-history me-2"></i>
                                        Recent Stock Transactions
                                    </Card.Title>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Shop</th>
                                                    <th>Opening</th>
                                                    <th>Sold</th>
                                                    <th>Closing</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stocks.slice(0, 5).map((stock, index) => (
                                                    <tr key={index}>
                                                        <td>{new Date(stock.date).toLocaleDateString()}</td>
                                                        <td>{stock.shop_name}</td>
                                                        <td>{Number(stock.opening_stock).toFixed(3)}</td>
                                                        <td className="text-primary">
                                                            {Number(stock.sale_Qty).toFixed(3)}
                                                        </td>
                                                        <td className="text-success">
                                                            {Number(stock.closing_stock).toFixed(3)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>

                {/* Right Sidebar (4 columns) */}
                <Col lg={4}>
                    <Card className="shadow mb-4">
                        <Card.Body>
                            <Card.Title>
                                <i className="fas fa-trophy me-2"></i>
                                Top Sales
                            </Card.Title>
                            <div className="list-group">
                                {topSales.map((sale, index) => (
                                    <div key={index} className="list-group-item">
                                        <div className="d-flex w-100 justify-content-between">
                                            <h6 className="mb-1">{sale.shop_name}</h6>
                                            <small>{new Date(sale.date).toLocaleDateString()}</small>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span>Sold: {Number(sale.sale_Qty).toFixed(3)}</span>
                                            <span className="badge bg-primary rounded-pill">
                                                #{index + 1}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title>
                                <i className="fas fa-chart-pie me-2"></i>
                                Sales Distribution
                            </Card.Title>
                            <div style={{ height: '200px' }}>
                                {/* Placeholder for chart - you would integrate a real chart library here */}
                                <div className="d-flex justify-content-center align-items-center h-100">
                                    <div className="text-center">
                                        <i className="fas fa-chart-pie fa-3x text-muted mb-2"></i>
                                        <p>Sales chart visualization</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <small className="text-muted">
                                    <i className="fas fa-info-circle me-1"></i>
                                    Total sales: {totalSaleQty.toFixed(3)} across {stocks.length} transactions
                                </small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default StockDashboard;
