// src/pages/MyDashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Button, Modal, Form, Table, Container } from 'react-bootstrap';
import Swal from 'sweetalert2';

const ClientProject = () => {
  const [projects, setProjects] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false)
  const [projectLoading, setProjectLoading] = useState(true)

  {/*fetch projects */}
  const fetchProjects = async () => {
    const res = await API.get('/projects/');
    setProjects(res.data); 
    setProjectLoading(false)
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  {/*Create and Edit Projects */}
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true) 

    try {
       if (editId) {
      await API.put(`/projects/${editId}`, form);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Project edited successfully',
        timer: 2000,
        showConfirmButton: false
      });

    } else {
      await API.post('/projects', form);
       Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Project Created successfully',
        timer: 2000,
        showConfirmButton: false
      });
    }
    setShow(false);
    fetchProjects();
    } catch (error) {
      const msg = error.response?.data?.message || 'Project creation failed';
      setError(msg); 
    } finally {
      setLoading(false)
    
    }
   
  };

  {/*Display Edit Form */}
  const handleEdit = (project) => {
    setForm(project);
    setEditId(project._id);
    setShow(true);
  };

  {/*Display if Project is still loading */}
  if (projectLoading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading projects...</span>
        </div>
        <p>Loading projects...</p>
      </Container>
    );
  }

  return (
    <div className="container mt-4">
      <h2>My Projects</h2>
      <Button onClick={() => { setForm({title: '', description: '', status: 'pending' }); setEditId(null); setShow(true); }}>Add Project</Button>

      <Table striped bordered className="mt-3">
        <thead>
          <tr><th>Title</th><th>Description</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p._id}>
              <td>{p.title}</td>
              <td>{p.description}</td>
              <td>{p.status}</td>
              <td>
                <Button size="sm" onClick={() => handleEdit(p)}>Edit</Button>{' '}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit' : 'Add'} Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
             {error && <div className="alert alert-danger">{error}</div>}
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control value={form.title} required onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control value={form.description} required onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="pending" selected>Pending</option>
                <option value="in-progress" unselectable=''>In Progress</option>
                <option value="completed" unselectable=''>Completed</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShow(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>{loading ? (<><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>) : ('Save')}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ClientProject;

