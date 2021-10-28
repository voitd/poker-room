import React, { useEffect, useState } from 'react'

const Haeder = () => {

  const userInfo = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  const [user, setUser] = useState(userInfo)
  const [chips, setChips] = useState()

  const handleLogout = useCallback(
    () => {
      localStorage.removeItem('user')
      setUser(null)
    },
    [setUser],
  ) 

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${user?.token}`
      }
    }

    const fetchData = async () => {
      try {
        const {data} = await axios.get('api/user/profile' + user._id, config)
        setChips(data.chips)
      } catch (error) {
        handleLogout()
        console.error('[error]: ', error); // eslint-disable-line no-console

      }
    }
    if (user) {
      fetchData()
    }
  })

  return (
    <div>
      
    </div>
  )
}

export default Haeder

