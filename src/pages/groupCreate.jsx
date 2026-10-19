import { useState } from "react"
import { useNavigate } from "react-router-dom"

function GroupCreation ({ logged }) {
    const [name, setName] = useState('')
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    async function createGroup (e) {
        e.preventDefault()
        // /conv/group/create
        try {
            let url = `${import.meta.env.VITE_API_URL}/conv/group/create`
            const token = localStorage.getItem('token')
            const res = await fetch( url, {
                method: "POST", 
                headers: {
                    Authorization: `Bearer ${token}` , 
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({ groupName: name })
            })

            if (res.ok) {
                const data = await res.json()
                const group = data.group
                console.log({group})
                navigate(`/conv/${group.id}`)
            } else if (res.status === 401) {
                setError("Log in to see/add friends.")
            } else {
                const data = await res.json()
                setError(data.error || "Could not load :(")
            }
        } catch (error) {
            console.log(error)
            setError(error.message)
        }
    }

    if (!logged) {
        return <div className="status">You are not logged in OR unauthorized for this conversation</div>
    }

    if (error) return <div className="status"><h2>{error}</h2></div>

    return (
        <div className="group-create">
            <form onSubmit={createGroup}>
                <label>
                    Group name 
                    <input 
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)} 
                        id="name" 
                        required
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default GroupCreation