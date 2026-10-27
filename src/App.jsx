import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { useEffect, useState, createContext } from 'react'
import { io } from 'socket.io-client'
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

// eslint-disable-next-line react-refresh/only-export-components
export const PresenceContext = createContext(new Set())

function App() {
  const [logged, setLogged] = useState(!!localStorage.getItem('token'))
  const [profile, setProfile] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null)
  const [onlineIds, setOnlineIds] = useState(new Set())

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

  // presence effect 
  useEffect(() => {
    if (!logged) return

    const socket = io(import.meta.env.VITE_API_URL, {
        auth: { token: localStorage.getItem('token') }
    })

    socket.on('onlineFriends', ids => setOnlineIds(new Set(ids)))

    socket.on('presence', ({ userId, online }) => {
        setOnlineIds(prev => {
            const next = new Set(prev)
            if (online) next.add(userId)
            else next.delete(userId)
            return next
        })
    })

    return () => {
        socket.disconnect()
        setOnlineIds(new Set())
    }
}, [logged])


  return (
    <BrowserRouter>
      <Nav logged={logged} setLogged={setLogged} profile={profile} setProfile={setProfile} />
      <PresenceContext.Provider value={onlineIds} >
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
      </PresenceContext.Provider>      
    </BrowserRouter>
  )
}

export default App
