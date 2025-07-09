import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/donations';

function App() {
  const [donations, setDonations] = useState([]);
  const [formData, setFormData] = useState({
    donorName: '',
    donationType: '',
    quantity: '',
    date: '',
  });
  const [editingId, setEditingId] = useState(null);

  const fetchDonations = async () => {
    try {
      const res = await axios.get(API_URL);
      setDonations(res.data);
    } catch (err) {
      console.error('Error fetching donations:', err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      donorName: '',
      donationType: '',
      quantity: '',
      date: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.donorName || !formData.donationType || !formData.quantity || !formData.date) {
      alert('Please fill in all fields.');
      return;
    }

    const payload = {
      donorName: formData.donorName.trim(),
      donationType: formData.donationType.trim(),
      quantity: Number(formData.quantity),
      date: formData.date,
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }

      resetForm();
      fetchDonations();
    } catch (err) {
      console.error('Error submitting donation:', err.response?.data || err.message);
      alert('Error submitting donation. Make sure all fields are filled.');
    }
  };

  const handleEdit = (donation) => {
    setFormData({
      donorName: donation.donorName,
      donationType: donation.donationType,
      quantity: donation.quantity,
      date: donation.date,
    });
    setEditingId(donation.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchDonations();
      } catch (err) {
        console.error('Error deleting donation:', err);
      }
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '30px auto', fontFamily: 'Segoe UI' }}>
      <h1 style={{ textAlign: 'center', color: '#4CAF50' }}>🌟 Donation Inventory Tracker</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          backgroundColor: '#f0f8ff',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '30px',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
        }}
      >
        <input
          name="donorName"
          value={formData.donorName}
          onChange={handleChange}
          placeholder="Donor Name"
          required
          style={inputStyle}
        />
        <input
          name="donationType"
          value={formData.donationType}
          onChange={handleChange}
          placeholder="Donation Type"
          required
          style={inputStyle}
        />
        <input
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
          style={inputStyle}
        />
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <button type="submit" style={editingId ? updateBtnStyle : addBtnStyle}>
          {editingId ? 'Update Donation' : 'Add Donation'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} style={cancelBtnStyle}>
            Cancel
          </button>
        )}
      </form>

      {donations.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>No donations yet. Add one above!</p>
      ) : (
        donations.map((donation) => (
          <div
            key={donation.id}
            style={{
              backgroundColor: '#fff',
              borderLeft: '6px solid #4CAF50',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '8px',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            <p><strong>{donation.donorName}</strong> donated <strong>{donation.quantity}</strong> of <strong>{donation.donationType}</strong> on <strong>{donation.date}</strong>.</p>
            <div>
              <button onClick={() => handleEdit(donation)} style={editBtnStyle}>Edit</button>
              <button onClick={() => handleDelete(donation.id)} style={deleteBtnStyle}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// 🌈 BUTTON STYLES
const addBtnStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  padding: '10px',
  borderRadius: '5px',
  cursor: 'pointer'
};

const updateBtnStyle = {
  ...addBtnStyle,
  backgroundColor: '#2196F3'
};

const cancelBtnStyle = {
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  padding: '10px',
  borderRadius: '5px',
  cursor: 'pointer'
};

const editBtnStyle = {
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  padding: '6px 10px',
  borderRadius: '5px',
  marginRight: '10px',
  cursor: 'pointer'
};

const deleteBtnStyle = {
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  padding: '6px 10px',
  borderRadius: '5px',
  cursor: 'pointer'
};

const inputStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '14px'
};

export default App;
