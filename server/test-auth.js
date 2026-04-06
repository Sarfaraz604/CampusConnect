const axios = require('axios');

const API_URL = 'http://localhost:3000/auth';
const testUser = {
  name: 'Test Antigravity',
  email: 'test.antigravity' + Date.now() + '@iiitagartala.ac.in',
  password: 'Password123!',
  role: 'student',
  branchCode: 'CSE',
  batch: '2025'
};

async function testAuth() {
  const axiosInstance = axios.create({
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  try {
    console.log('Testing Signup...');
    const signupRes = await axiosInstance.post(`${API_URL}/signup`, testUser);
    console.log('Signup Successful:', signupRes.data.message);

    console.log('Testing Logout...');
    const logoutRes = await axiosInstance.post(`${API_URL}/logout`);
    console.log('Logout Successful:', logoutRes.data.message);

    console.log('Testing Login...');
    const loginRes = await axiosInstance.post(`${API_URL}/login`, {
      email: testUser.email,
      password: testUser.password,
      role: testUser.role
    });
    console.log('Login Successful:', loginRes.data.message);
    
  } catch (error) {
    console.error('Test Failed!');
    if (error.response) {
      console.error('Response Error:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testAuth();
