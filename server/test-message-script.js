// const io = require('socket.io-client');
// const axios = require('axios');

// async function testWebSocket() {
//   try {
//     // 1. Login
//     const loginResponse = await axios.post('http://localhost:3000/auth/login', {
//       email: 'bt22cse113@iiitagartala.ac.in',
//       password: 'anuj123!'
//     }, { 
//       withCredentials: true,
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });

//     console.log('Login Response:', loginResponse.data);

//     // Extract cookies
//     const cookies = loginResponse.headers['set-cookie'];

//     // 2. WebSocket Connection
//     const socket = io('http://localhost:3000', {
//       withCredentials: true,
//       extraHeaders: {
//         Cookie: cookies.join('; '),
//         Origin: 'http://localhost:3000'
//       },
//       transportOptions: {
//         polling: {
//           extraHeaders: {
//             Cookie: cookies.join('; ')
//           }
//         }
//       }
//     });

//     // Connection Events
//     socket.on('connect', () => {
//       console.log('WebSocket Connected Successfully');
//       console.log('Socket ID:', socket.id);

//       // Test message sending
//       const recipientId = '67cb63e093b47d714666fc86';
//       socket.emit('sendMessage', {
//         recipientId: recipientId,
//         content: 'cleaning done'
//       });
//     });

//     // Message Handling
//     socket.on('messageSent', (message) => {
//       console.log('Message Sent Successfully:', message);
//     });

//     socket.on('messageError', (error) => {
//       console.error('Message Sending Error:', error);
//     });

//     // Keep connection open for testing
//     await new Promise(resolve => setTimeout(resolve, 15000));

//   } catch (error) {
//     console.error('WebSocket Test Failed:', 
//       error.response ? error.response.data : error.message
//     );
//     console.error('Full Error:', error);
//   }
// }

// testWebSocket();