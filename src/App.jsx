import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { useEffect, useState } from 'react'
import Nav from './components/nav'
import Home from './pages/home'
import Register from './pages/register'
import Login from './pages/login'
import Search from './pages/search'
import ViewConv from './pages/viewConv'
import Friends from './pages/friends'
import GroupCreation from './pages/groupCreate'
import GroupDetail from './pages/groupDetail'
import Profile from './pages/profile'

function App() {
  const [logged, setLogged] = useState(!!localStorage.getItem('token'))
  const [profile, setProfile] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
		if (logged) {
			try {
				const token = localStorage.getItem('token')
				const res = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
					headers: { Authorization: `Bearer ${token}` }
				})

				if (res.ok) {
					const data = await res.json()
					setProfile(data.profile)
				} else if (res.status === 401) {
					setError("You are not authorized for tha requested data.")
				} else {
					const data = await res.json()
					setError(data.error || "Could not load :(")
				}
				
				} catch (error) {
				console.log(error)
			}
		}
      

    })()
    
  }, [logged])


  return (
    <BrowserRouter>
      <Nav logged={logged} setLogged={setLogged} profile={profile} setProfile={setProfile} />
      <Routes>
        <Route path='/' element={<Home logged={logged} />} />
        <Route path='/register' element={<Register logged={logged} />} />
        <Route path='/login' element={<Login logged={logged} setLogged={setLogged} />} /> 
        <Route path='/search' element={<Search />} />
        <Route path='/conv/:convId' element={<ViewConv logged={logged} />} />
        <Route path='/friends' element={<Friends logged={logged} />} /> 
        <Route path='/create/group' element={<GroupCreation logged={logged} />} />
        <Route path='/conv/detail/:convId' element={<GroupDetail logged={logged} />} />
        <Route path='/profile' element={<Profile logged={logged} profile={profile} setProfile={setProfile} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
