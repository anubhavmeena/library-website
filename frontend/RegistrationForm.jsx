import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
  const [form, setForm] = useState({
    name: '',
    fatherName: '',
    age: '',
    phone: '',
    email: '',
    shiftHours: '6',
  });

  const shiftPrices = { '6': 400, '12': 500, '24': 600 };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const amount = shiftPrices[form.shiftHours] * 100;

      // 1. Create Razorpay order from backend
      const { data: order } = await axios.post('http://localhost:8080/api/create-order', {
        ...form,
        amount,
      });

      // 2. Open Razorpay checkout
      const options = {
        key: 'RAZORPAY_KEY_ID', // replace with your Razorpay key
        amount,
        currency: 'INR',
        name: 'Library Registration',
        description: 'Monthly Membership',
        order_id: order.razorpayOrderId,
        handler: async function (response) {
          // 3. Send payment success response to backend
          await axios.post('http://localhost:8080/api/payment-success', {
            ...form,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          });
          alert('Registration successful! Check your email.');
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Error during registration.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Library Registration</h2>
      {['name', 'fatherName', 'age', 'phone', 'email'].map((field) => (
        <input
          key={field}
          className="block w-full mb-3 p-2 border"
          name={field}
          placeholder={field.replace(/([A-Z])/g, ' $1')}
          onChange={handleChange}
        />
      ))}
      <select name="shiftHours" className="w-full mb-4 p-2 border" onChange={handleChange}>
        <option value="6">6 Hours (₹400)</option>
        <option value="12">12 Hours (₹500)</option>
        <option value="24">24 Hours (₹600)</option>
      </select>
      <button onClick={handleRegister} className="w-full bg-blue-500 text-white py-2 rounded">
        Register & Pay
      </button>
    </div>
  );
};

export default RegistrationForm;

