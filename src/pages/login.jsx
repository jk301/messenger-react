import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Login({ logged, setLogged }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()

    useEffect (() => {
        if (logged) {
            console.log('already logged in, returning home.')
            navigate('/')
            return 
        }      
    }, [logged, navigate])


    async function handleLogin (e) {
        e.preventDefault()
        setError('') 

        try {
            console.log('fetching')
            const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ username, password })
            })
            console.log('fetched')

            if (res.status === 401) {
                setError('Invalid email or password.')
                return
            }

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Something went wrong.")
                return 
            }

            // token
            setLogged(true)
            console.log('Logged in.')
            localStorage.setItem("token", data.token)
            navigate('/')

        } catch (err) {
            console.log(err)
            setError("Network error, try again.")
        }
    }

  return (
    <div className="login">
        <h1>Login</h1>
        {error && <p>{error}</p>}
        <form onSubmit={handleLogin}>
            <label htmlFor="username">Username</label>
            <input 
                type="text" 
                id="username"
                value={username}
                onChange={(e) => {setUsername(e.target.value)}} 
                required
            />
            <label htmlFor="password">Password</label>
            <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => {setPassword(e.target.value)}}
                required
            />
            <button type="submit" >Login</button>
        </form>
    </div>
  )
}

export default Login