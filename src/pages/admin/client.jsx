import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Button, Form, Modal, Table, Container } from 'react-bootstrap';
import Swal from 'sweetalert2';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([])
  const [currentClient, setCurrentClient] = useState({ name: '', email: '', phone: '', company: '', notes: '', user: '' });
  const [editId, setEditId] = useState(null);
  const [clientLoading, setClientLoading] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
  api.get('/auth/users')
    .then(res => setUsers(res.data))
    .catch(err => console.error('Failed to load users', err));
}, []);

  useEffect(() => {
    fetchClients();
  }, []);

  {/*fetch clients */}
  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      setClients(res.data);
    } catch (e) {
      console.error('Error fetching projects', e);
    } finally{
      setClientLoading(false)
    
    }
  };

   {/*Add new Client */}
  const handleShow = () => {
    setCurrentClient({ name: '', email: '', phone: '', company: '', notes: '' });
    setEditId(null);
    setShow(true);
  };

   {/*Edit Client name */}
  const handleEdit = (client) => {
    setEditId(client._id);
    setCurrentClient(client);
    setShow(true);
  };

   {/*delete client */}
  const handleDelete = async (Id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete this client?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/clients/${Id}`);

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Client deleted successfully.',
        timer: 2000,
        showConfirmButton: false
      });
      fetchClients();

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response?.data?.message || 'Failed to delete client'
      });
    }
  }
};

   {/*Edit or add new Client */}
  const handleSubmit = async () => {
    if (editId) {
      try {
        setLoading(true)
      await api.put(`/clients/${editId}`, currentClient);
       Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Client updated successfully.',
        timer: 2000,
        showConfirmButton: false
      });
      setLoading(false)
     
      } catch (err) {
        Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response?.data?.message || 'Failed to update'
      });  
      } finally{
        setLoading(false)
      }
     

    } else {
      try {
        setLoading(true)
        await api.post('/clients', currentClient);
       Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: 'Client added successfully.',
        timer: 2000,
        showConfirmButton: false
      });
      setLoading(false)
    
      } catch (err) {
        Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'only one client per user'
      }); 
      } finally {
        setLoading(false)
      }
    }
    setShow(false);
    fetchClients();
    
  };

   {/*displayed if client list is still loading */}
  if (clientLoading) {
  return (
    <Container className="mt-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading clients...</span>
      </div>
      <p>Loading clients...</p>
    </Container>
  );
}

  return (
    <div className="container mt-4">
      <h2>Clients</h2>
      <Button className="mb-3" onClick={handleShow}>Add Client</Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client._id}>
              <td>{client.user?.email}</td>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.phone}</td>
              <td>{client.company}</td>
              <td>{client.notes}</td>
              <td>
                <Button size="sm" onClick={() => handleEdit(client)}>Edit</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(client._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit' : 'Add'} Client</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control value={currentClient.name} onChange={(e) => setCurrentClient({ ...currentClient, name: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control value={currentClient.email} onChange={(e) => setCurrentClient({ ...currentClient, email: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control value={currentClient.phone} onChange={(e) => setCurrentClient({ ...currentClient, phone: e.target.value })} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Company</Form.Label>
              <Form.Control value={currentClient.company} onChange={(e) => setCurrentClient({ ...currentClient, company: e.target.value })} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Notes</Form.Label>
              <Form.Control value={currentClient.notes} onChange={(e) => setCurrentClient({ ...currentClient, notes: e.target.value })} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Assign to User</Form.Label>
              <Form.Select
                value={currentClient.user || ''}
                onChange={(e) => setCurrentClient({ ...currentClient, user: e.target.value })}>
                <option value="">Select a user</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.email}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => setShow(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? (<><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>) : ('Save' )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Clients;