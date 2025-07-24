// src/pages/Dashboard.js
import { useContext, useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/authContext';
import { Card, Row, Col } from 'react-bootstrap';

function AdminDashboard() {
  const { user } = useAuth()
  const [clientCount, setClientCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const clientsRes = await api.get('/clients');
        setClientCount(clientsRes.data.length);

        const projectsRes = await api.get('/projects');
        setProjectCount(projectsRes.data.length);

        const userRes = await api.get('/auth/users')
        setUserCount(userRes.data.length)
      } catch (error) {
        console.error('Failed to load dashboard stats:', error.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Dashboard</h2>
      <Row>
        <Col md={6}>
          <Card bg="primary" text="white" className="mb-3 shadow">
            <Card.Body>
              {clientCount ?(<>
              <Card.Title>Total Clients</Card.Title>
              <Card.Text style={{ fontSize: '2rem' }}>{clientCount}</Card.Text>
              </>): (<p>Loading clients....</p>)}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card bg="success" text="white" className="mb-3 shadow">
            <Card.Body>
              {projectCount ? (<>
              <Card.Title>Total Projects</Card.Title>
              <Card.Text style={{ fontSize: '2rem' }}>{projectCount}</Card.Text>
              </>) : (<p>Loading projects....</p>)}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card bg="info" text="white" className="mb-3 shadow">
            <Card.Body>
              {userCount ? (<>
              <Card.Title>Total Users</Card.Title>
              <Card.Text style={{ fontSize: '2rem' }}>{userCount}</Card.Text>
              </>): (<p>Loading users....</p>)}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Welcome, {user?.email}</Card.Title>
          <Card.Text>Role: {user?.role}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AdminDashboard;