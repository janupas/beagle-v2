import React, { useEffect } from 'react'
import axios from 'axios'

function App() {
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/users')
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }, [])

  return (
    <React.Fragment>
      <h1>Hello, world</h1>
    </React.Fragment>
  )
}

export default App
