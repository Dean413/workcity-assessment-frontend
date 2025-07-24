// src/pages/Projects.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Button, Form, Modal, Table, Container } from 'react-bootstrap';
import Swal from 'sweetalert2';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("")
  const [projectLoading, setProjectLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  
  const [currentProject, setCurrentProject] = useState({
    title: '',
    description: '',
    client: '',
    user: '',
    status: 'pending'
  });

  const statusOptions = ['pending', 'in-progress', 'completed'];

  useEffect(() => {
    fetchProjects();
    fetchClients();
    fetchUsers();
  }, []);

   {/*fetch projects */}
  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response?.data?.message || 'Failed to fetch projects'
      })
    } finally {
      setProjectLoading(false)
    }
  };

   {/*fetch clients */}
  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      setClients(res.data);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response?.data?.message || 'Failed to fetch projects'
      })
    }
  };

   {/*fetch users */}
  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response?.data?.message || 'Failed to fetch projects'
      })
    }
  };

   {/*Show Project Form */}
  const handleShow = () => {
    setCurrentProject({
      title: '',
      description: '',
      client: '',
      user: '',
      status: 'pending'
    });
    setEditId(null);
    setShow(true);
  };
   {/*Edit Project */}
  const handleEdit = (project) => {
    setEditId(project._id);
    setCurrentProject({
      title: project.title,
      description: project.description,
      client: project.client?._id || project.client || '',
      user: project.user?._id || project.user || '',
      status: project.status || 'pending'
    });
    setShow(true);
  };

   {/*fetch project by client name */}
  useEffect(() => {
    const fetchProjects = async () => {
    const res = await api.get(`/projects?clientName=${search}`);
    setProjects(res.data);
    };
    fetchProjects();
  }, [search]);

  const clearFilter = async () => {
   setSearch('');
    const res = await api.get('/projects');
    setProjects(res.data);
  };

   {/*Delete Project */}
  const handleDelete = async (Id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this project?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/projects/${Id}`);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Project deleted successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        fetchProjects();

      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.response?.data?.message || 'Failed to delete project'
        });
      }
    }       
  };

  {/*Add Project */}
  const handleSubmit = async () => {
    if (!currentProject.title.trim() || !currentProject.description.trim()) {
      alert('Both title and description are required.');
      return;
    }

    try {
      if (editId) {
        setLoading(true)
        await api.put(`/projects/${editId}`, currentProject);
         Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Project updated successfully.',
        timer: 2000,
        showConfirmButton: false
      }); setLoading(false);
      } else {
        setLoading(true)
        await api.post('/projects', currentProject);
        Swal.fire({
        icon: 'success',
        title: 'Created!',
        text: 'Project created successfully.',
        timer: 2000,
        showConfirmButton: false
      }); setLoading(false)
        
      }
      setShow(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response?.data?.message || 'Error'
      });
    } finally {
      setLoading(false)
    }
  };

   {/*display if project is loading */}
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
      <div className='d-flex gap-3'>
        <h2>Projects</h2>
        <input
        type="text"
        className="form-control mb-3"
        placeholder="Search Project by client name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}/>
        <Button className='mb-3' onClick={clearFilter}>clear</Button>
      </div>
      
      <Button className="mb-3" onClick={handleShow}>Add Project</Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project._id}>
              <td>{project.client?.name}</td>
              <td>{project.title}</td>
              <td>{project.description}</td>
              <td>{project.status}</td>
              <td>
                <Button size="sm" onClick={() => handleEdit(project)}>Edit</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(project._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit Project */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit' : 'Add'} Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Assign to User</Form.Label>
              <Form.Select
                value={currentProject.user}
                onChange={(e) => setCurrentProject({ ...currentProject, user: e.target.value })}>
                <option value="">Select a user</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.email}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Client</Form.Label>
              <Form.Select
                value={currentProject.client}
                onChange={(e) => setCurrentProject({ ...currentProject, client: e.target.value })}>
                <option value="">Select client</option>
                {clients.map(client => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={currentProject.title}
                onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={currentProject.description}
                onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={currentProject.status}
                onChange={(e) => setCurrentProject({ ...currentProject, status: e.target.value })}>
                <option value="">Select status</option>
                {statusOptions.map((status, index) => (
                  <option key={index} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>{loading ? (<><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>) : ('Save')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Projects;
