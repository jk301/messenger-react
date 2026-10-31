import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import '../style/inputPage.css'

function Register({ logged }) {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()

    useEffect (() => {
            if (logged) {
                console.log('already logged in, returning home.')
                navigate('/')
                return 
            }      
        }, [logged, navigate])

    async function handleReg (e) {
        e.preventDefault()
        setError('')

        if (password !== confirm) {
            setError("Passwords don't match.")
            return 
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ email, username, password })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Something went wrong.")
                return 
            }

            navigate('/login')

        } catch (err) {
            console.log(err)
            setError("Network error, try again.")
        }
    }

  return (
    <div className="register">
        <h1>Sign up</h1>
        {error && <p>{error}</p>}
        <form onSubmit={handleReg}>
            <div className="labels">
                <label htmlFor="email">Email * 
                    <input 
                        type="email" 
                        id="email"
                        value={email}
                        onChange={(e) => {setEmail(e.target.value)}}
                    />
                </label>

                <label htmlFor="username">Username *
                <input 
                    type="text" 
                    id="username"
                    value={username}
                    onChange={(e) => {setUsername(e.target.value)}}
                />
                </label>

                <label htmlFor="password">Password
                <input 
                    type="password" 
                    id="password" 
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                </label>

                <label htmlFor="confirm">Confirm password
                <input 
                    type="password" 
                    id="confirm" 
                    value={confirm}
                    onChange={(e) => {setConfirm(e.target.value)}}
                />
                </label>
            </div>
            
            <button type="submit" >Register</button>
        </form>
    </div>
  )
}

export default Register