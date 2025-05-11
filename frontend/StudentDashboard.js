
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [seatNumber, setSeatNumber] = useState('');
  const [complaint, setComplaint] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('/api/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStudent(res.data))
      .catch(err => console.error(err));
  }, []);

  const handlePhotoUpload = () => {
    const formData = new FormData();
    formData.append('file', photo);
    axios.post('/api/upload-photo', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }).then(() => alert('Photo uploaded'));
  };

  const handleSeatSelect = () => {
    axios.post('/api/select-seat', { seatNumber }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => alert('Seat selected'));
  };

  const handleComplaint = () => {
    axios.post('/api/complaint', { message: complaint }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => alert('Complaint submitted'));
  };

  const handleRenew = () => {
    axios.post('/api/renew', {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => alert('Membership renewed'));
  };

  const downloadID = () => {
    axios.get('/api/download-id', {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    }).then(res => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'idcard.pdf');
      document.body.appendChild(link);
      link.click();
    });
  };

  if (!student) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome, {student.name}</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Account Details</h2>
        <p><b>Student ID:</b> {student.studentId}</p>
        <p><b>Email:</b> {student.email}</p>
        <p><b>Phone:</b> {student.phone}</p>
        <p><b>Shift:</b> {student.shiftHours} hours</p>
        <p><b>Membership:</b> {student.startDate} to {student.endDate}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Upload Photo</h2>
        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
        <button onClick={handlePhotoUpload} className="ml-2 px-4 py-1 bg-blue-500 text-white rounded">Upload</button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Seat Selection</h2>
        <input type="text" value={seatNumber} onChange={e => setSeatNumber(e.target.value)} placeholder="Enter seat number" className="p-1 border rounded" />
        <button onClick={handleSeatSelect} className="ml-2 px-4 py-1 bg-green-500 text-white rounded">Select</button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Generate ID Card</h2>
        <button onClick={downloadID} className="px-4 py-2 bg-purple-600 text-white rounded">Download ID Card</button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Raise Complaint</h2>
        <textarea value={complaint} onChange={e => setComplaint(e.target.value)} className="w-full p-2 border rounded" rows="4" placeholder="Write your complaint here"></textarea>
        <button onClick={handleComplaint} className="mt-2 px-4 py-1 bg-red-500 text-white rounded">Submit</button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Renew Membership</h2>
        <button onClick={handleRenew} className="px-4 py-2 bg-yellow-500 text-white rounded">Renew Now</button>
      </div>
    </div>
  );
}
