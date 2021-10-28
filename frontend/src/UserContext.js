import {createContext} from 'react' 
import axios from 'axios'


export const UserContext = createContext(null)

export const login = async (email, pass) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const {data} = await axios.post('/api/user/login',{email, pass}, config)
  localStorage.setItem('user', JSON.stringify(data))

  return data
}
