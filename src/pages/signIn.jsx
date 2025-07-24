import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignIn = () => {
  const { signin } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/login', form);
      signin(res.data);
      setForm({email: '', password: ''})
    } catch (err) {
      setError(err.response?.data?.message || 'Sign In Failed');
    } finally{
      setLoading(false)
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow p-4 w-100" style={{ maxWidth: '500px' }}>
        <h3 className="mb-4 text-center text-success">Sign in to Your Account</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        {/*sign in form */}
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              id="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email address</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Password</label>
          </div>

          <div className="d-grid"> {/*submit button */}
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </>
                ) : ('Sign In')
              }
            </button>
          </div>
        </form>

        <div className="mt-3 text-center">Don't have an account? <Link to="/">Sign Up</Link></div>
      </div>
    </div>
  );
};

export default SignIn;
