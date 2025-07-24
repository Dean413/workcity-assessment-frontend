import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Button, Form, Container } from 'react-bootstrap';
import Swal from 'sweetalert2';

const ClientProfile = () => {
  const [initialLoading, setInitialLoading] = useState(true)
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false)

  const [editing, setEditing] = useState(false);

  {/*get client profile */}
  useEffect(() => {
    api.get('/clients/profile')
      .then(res => {
        setProfile(res.data);
        setForm(res.data);
      })
      .catch(err => {
         Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.response?.data?.message || 'Failed to fetch profile'
          });
        setProfile(null);
      }).finally(() => {
        setInitialLoading(false)
      })
  }, []);

 
  {/*Create and View Profile*/}
 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      await api.post('/clients/profile', form);
      setEditing(false);
      Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `${editing ? "profile edited successfully" : "Profile created successfully"}`,
          timer: 2000,
          showConfirmButton: false
          });
      const updated = await api.get('/clients/profile');
      setProfile(updated.data);
    } catch (err) {
      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.response?.data?.message || 'Failed to Create Profile'
        });
    } finally{
      setLoading(false)
    }
  };

  {/*display if profile is still loading */}
  if (initialLoading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
        <p>Loading profile...</p>
      </Container>
    );
  }

  if (!profile || editing) {
    {/*Display Form if no Profile */}
    return ( 
      <Container className="mt-4">
        <div className="mx-auto" style={{ maxWidth: '500px' }}>
          <h2>{profile ? 'Edit Profile' : 'Create Profile'}</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
              size="lg"
              required
              type='text'
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
              required
              type='email'
              size="lg"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Form.Control
              size="lg"
              value={form.company}
              onChange={e => setForm({ ...form, company: e.target.value })}/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
              size="lg"
              type='number'
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}/>
            </Form.Group>
            <Button size="sm" type="submit" disabled={loading}> {loading ? (<><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>) : ('Save')}</Button>
          </Form>
        </div>
      </Container>
    );
  }

  {/*Return if profile exists or has been created */}
  return (
    <Container className="mt-4">
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Company:</strong> {profile.company}</p>
      <p><strong>Phone:</strong> {profile.phone}</p>
      <Button onClick={() => setEditing(true)}>Edit Profile</Button>
    </Container>
  );
};

export default ClientProfile;
