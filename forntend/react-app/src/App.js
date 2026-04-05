import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ invoiceID: '', amount: '', method: 'cash', notes: '' });
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) fetchPayments();
  }, [token]);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${API_BASE}/payments`, { headers: { Authorization: `Bearer ${token}` } });
      setPayments(res.data);
    } catch (err) {
      alert('Lỗi khi lấy danh sách thanh toán');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/payments`, form, { headers: { Authorization: `Bearer ${token}` } });
      setForm({ invoiceID: '', amount: '', method: 'cash', notes: '' });
      fetchPayments();
    } catch (err) {
      alert('Lỗi khi tạo thanh toán');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/payments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchPayments();
    } catch (err) {
      alert('Lỗi khi xóa thanh toán');
    }
  };

  return (
    <div className="App">
      <h1>Quản lý Thanh toán</h1>
      {!token ? (
        <div>
          <input type="text" placeholder="Token" value={token} onChange={(e) => setToken(e.target.value)} />
          <button onClick={() => localStorage.setItem('token', token)}>Lưu Token</button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Invoice ID" value={form.invoiceID} onChange={(e) => setForm({...form, invoiceID: e.target.value})} required />
            <input type="number" placeholder="Số tiền" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} required />
            <select value={form.method} onChange={(e) => setForm({...form, method: e.target.value})}>
              <option value="cash">Tiền mặt</option>
              <option value="transfer">Chuyển khoản</option>
            </select>
            <input type="text" placeholder="Ghi chú" value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} />
            <button type="submit">Thêm Thanh toán</button>
          </form>
          <ul>
            {payments.map(p => (
              <li key={p._id}>
                {p.amount} - {p.method} - {p.notes} <button onClick={() => handleDelete(p._id)}>Xóa</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
