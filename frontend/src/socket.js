import io from 'socket.io-client'

const BACKEND_URL = 'https://localhost:5000'
const socket = io(BACKEND_URL)

socket.on('createTable', data => {
  console.log('data ->', data); // eslint-disable-line no-console
})
