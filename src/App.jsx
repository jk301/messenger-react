import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { useState } from 'react'
import Nav from './components/nav'
import Home from './pages/home'
import Register from './pages/register'
import Login from './pages/login'
import Search from './pages/search'
import ViewConv from './pages/viewConv'
import Friends from './pages/friends'
import GroupCreation from './pages/groupCreate'

function App() {
  const [logged, setLogged] = useState(!!localStorage.getItem('token'))
  return (
    <BrowserRouter>
      <Nav logged={logged} setLogged={setLogged} />
      <Routes>
        <Route path='/' element={<Home logged={logged} />} />
        <Route path='/register' element={<Register logged={logged} />} />
        <Route path='/login' element={<Login logged={logged} setLogged={setLogged} />} /> 
        <Route path='/search' element={<Search />} />
        <Route path='/conv/:convId' element={<ViewConv logged={logged} />} />
        <Route path='/friends' element={<Friends logged={logged} />} /> 
        <Route path='/create/group' element={<GroupCreation logged={logged} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
