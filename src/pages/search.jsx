import { useState } from "react"

function Search () {
    const [term, setTerm] = useState('')
    const [result, setResult] = useState([])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

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

    if (loading) return <div className="status"><h2>Fetching users..</h2></div>
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
            { result.length > 0 
                && <div className="result-div">
                    {result.map( user => (
                        <div className="" key={user.id}>
                            <h2>{user.username}</h2>
                        </div>
                    ))}
                </div>
            }
        </div>
        
    )
}

export default Search