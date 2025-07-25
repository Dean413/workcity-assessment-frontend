import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/authContext';
import { Card, Row, Col } from 'react-bootstrap';

function ClientDashboard() {
  const { user } = useAuth();
  const [projectCount, setProjectCount] = useState(0);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const projectRes = await api.get('/projects'); 
        setProjectCount(projectRes.data.length);

        const clientRes = await api.get('/clients/profile');
        setClient(clientRes.data);
      } catch (error) {
        console.error('Dashboard data error:', error.message);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Client Dashboard</h2>
      <Row>
        <Col xs={12} md={3} >
          <Card bg="primary" text="white" className="mb-3 shadow" style={{height: "190px"}}>
            <Card.Body>
                <Card.Title style={{textAlign: "center"}}>Your Projects</Card.Title>
                {client ? ( <>
              <Card.Text style={{ fontSize: '6rem', textAlign: "center" }}>{projectCount}</Card.Text>
               </>) : (<p>Loading.....</p>)}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card bg="success" text="white" className="mb-3 shadow">
            <Card.Body>
              <Card.Title>Your Profile</Card.Title>
              {client ? (
                <>
                  <p><strong>Name:</strong> {client.name}</p>
                  <p><strong>Company:</strong> {client.company}</p>
                  <p><strong>Email:</strong> {client.email}</p>
                </>) : (<p>Loading...</p>)}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mt-4" style={{width: "58%"}}>
        <Card.Body>
          <Card.Title>Account Info</Card.Title>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ClientDashboard;
