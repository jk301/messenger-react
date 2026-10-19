import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import '../style/groupDetail.css'

function GroupDetail ({ logged }) {
    const { convId } = useParams()
    const [conv, setConv] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch the conversation
    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem('token')
                const url = `${import.meta.env.VITE_API_URL}/conv/${convId}`
                const res = await fetch( url, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (res.ok) {
                    const data = await res.json()
                    setConv(data.conv)
                } else if (res.status === 401) {
                    setError("Want to Start messaging? sign up & log in.")
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
        })()

    }, [convId])


    if (!logged) {
        return <div className="status">You are not logged in OR unauthorized for this conversation</div>
    }

    if (error) return <div className="status"><h2>{error}</h2></div>

    console.log(conv)
    return (
        <div className="group-detail">
            {loading 
                ? <div><h2>Fetching details</h2></div>
                : <div className="group-detail-content">
                    <h2>{conv.name ?? "Group name doesn't exist"}</h2>
                    <p>Created at: {conv.createdAt}</p>
                    <div className="member-container">
                        <h2>Members</h2>
                        <div className="member-div">
                            {conv.participants.map( p => (
                                <div className="member-card">
                                    <h4>{p.user.username}</h4>
                                    <p>Role: {p.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="group-buttons">
                        {conv.isAdmin && <button>Delete group</button>} 
                    </div>
                </div>
            }
        </div>
    )
}

export default GroupDetail