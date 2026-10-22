import { useState } from "react"
import { useNavigate } from "react-router-dom"

import '../style/search.css'


function Search () {
    const [term, setTerm] = useState('')
    const [result, setResult] = useState([])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const [toggle, setToggle] = useState(false)
    const [selected, setSelected] = useState(null)
    const [groups, setGroups] = useState([])

    const navigate = useNavigate()

    async function handleSearch (e) {
        e.preventDefault()

        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const URL = `${import.meta.env.VITE_API_URL}/users/search?name=${encodeURIComponent(term)}`
            const res = await fetch(URL, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.ok) {
                const data = await res.json()
                setResult(data.result)
            } else if (res.status === 401) {
                setError("You are not authorized for search.")
            } else {
                const data = await res.json()
                setError(data.error || "Could not load :(")
            }

        } catch (error) {
            console.log(error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

   async function sendReq (userId) {
        try {
            const token = localStorage.getItem('token')
            const URL = `${import.meta.env.VITE_API_URL}/friend/${userId}/request`
            const res = await fetch(URL, {
                method: "POST", 
                'Content-Type': 'application/json', 
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                navigate('/friends')
            } else if (res.status === 401) {
                setError("You are not authorized for this request.")
            } else {
                const data = await res.json()
                setError(data.error || "Could not send request :(")
            }
        } catch (error) {
            console.log(error)
            setError(error.message)
        }
   }

   async function handleGroupSelect (userId) {
        try {
            const token = localStorage.getItem('token')
            const url = `${import.meta.env.VITE_API_URL}/conv/group/admin`
            const res = await fetch( url, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.ok) {
                const data = await res.json()
                setSelected(userId)
                setGroups(data.convs)
            } else if (res.status === 401) {
                setError("You are not authorized for search.")
            } else {
                const data = await res.json()
                setError(data.error || "Could not load :(")
            }
        } catch (error) {
            console.log(error)
            setError(error.message)
        } finally {
            setToggle(true)
        }
    }

    async function addToGroup (convId, userId) {
        // /conv/:groupId/add/:userId
        try {
            const token = localStorage.getItem('token')
            const url = `${import.meta.env.VITE_API_URL}/conv/${convId}/add/${userId}`
            const res = await fetch( url, {
                method: "POST", 
                headers: {
                    Authorization: `Bearer ${token}`, 
                    "Content-Type": "application/json"
                }
            })

            if (res.ok) {
                navigate(`/conv/detail/${convId}`)
            } else if (res.status === 401) {
                setError("You are not authorized for action.")
            } else {
                const data = await res.json()
                setError(data.error || "Could not load :(")
            }
        } catch (error) {
            console.log(error)
            setError(error.message)
        }
    }



	if (error) return <div className="status"><h2>{error}</h2></div>

    return (
        <div className="search">
            <form onSubmit={handleSearch} >
                <input 
                    type="text" 
                    placeholder="search" 
                    value={term} 
                    onChange={e => setTerm(e.target.value)}
                    required
                />
                <button type="submit">Search</button>
            </form>
            {loading 
                ? <div className="status"><h2>Fetching users..</h2></div>
                : result.length > 0 
                    ? <div className="result-div">
                        {result.map( user => (
                            <div className="result-card" key={user.id}>
                                <img 
                                    src={user.avatarURL ?? '/public/user.jpg'} 
                                    className="avatars"
                                />
                                <h2>{user.username}</h2>
                                {user.status 
                                    ? <p>Friend status: {user.status}</p>
                                    : <button 
                                        onClick={() => sendReq(user.id)}
                                    >
                                        Send friend request
                                    </button>
                                }
                                <button onClick={() => handleGroupSelect(user.id)}>Add to group</button>
                            </div>
                        ))}
                    </div>

                    : <div className="result-div">
                        <h3>searched users will appear here [nothing here]</h3>
                    </div>
            }

            {toggle 
                && (<div className="overlay" onClick={() => setToggle(false)}>
                    <div className="select-group-div" onClick={e => e.stopPropagation()}>
                        <h2>Select from one of the groups below</h2>
                        <p>(where you are the admin)</p>
                        <div className="group-selections">
                            {groups.length > 0 
                                ? <div className="group-container">
                                    {groups.map( g => (
                                        <div 
                                            onClick={() => addToGroup(g.id, selected)} 
                                            key={g.id} 
                                            className="group-card"
                                        >
                                            <h3>{g.name}</h3>
                                        </div>
                                    ))}
                                </div>
                                : <div>
                                    <p>There are no groups where you are the admin</p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                ) 
            } 
            
        </div>
        
    )
}

export default Search