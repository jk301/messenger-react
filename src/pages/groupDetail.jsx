import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

import '../style/groupDetail.css'

function GroupDetail ({ logged }) {
    const { convId } = useParams()
    const [conv, setConv] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [file, setFile] = useState(null)

    const navigate = useNavigate()

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

    async function handleAvatar (e) {
        // /conv/:groupId/avatar
		e.preventDefault()
		try {
			setLoading(true)

			const formData = new FormData()
			formData.append('avatar', file)

			const token = localStorage.getItem('token')
			const res = await fetch(`${import.meta.env.VITE_API_URL}/conv/${conv.id}/avatar`, {
				method: "PATCH", 
				headers: {
					Authorization: `Bearer ${token}`, 
				}, 
				body: formData
			})

			if (res.ok) {
				const data = await res.json()
                setConv(data.updated)
			} else if (res.status === 401) {
				setError("Unauthorized request")
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

    async function makeAdmin (convId, userId) {
        // /conv/:groupId/admin/:userId

        try {
            const token = localStorage.getItem('token')
            const url = `${import.meta.env.VITE_API_URL}/conv/${convId}/admin/${userId}`
            const res = await fetch( url, {
                method: "POST", 
                headers: {
                    Authorization: `Bearer ${token}`, 
                    "Content-Type": "application/json"
                }
            })

            if (res.ok) {
                window.location.reload()
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

    async function removeMember (convId, userId) {
        // /conv/:groupId/remove/:userId

        try {
            const token = localStorage.getItem('token')
            const url = `${import.meta.env.VITE_API_URL}/conv/${convId}/remove/${userId}`
            const res = await fetch( url, {
                method: "POST", 
                headers: {
                    Authorization: `Bearer ${token}`, 
                    "Content-Type": "application/json"
                }
            })

            if (res.ok) {
                window.location.reload()
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

    async function deleteGroup (convId) {
        // /conv/:groupId
        try {
            const token = localStorage.getItem('token')
            const url = `${import.meta.env.VITE_API_URL}/conv/${convId}`
            const res = await fetch( url, {
                method: "DELETE", 
                headers: {
                    Authorization: `Bearer ${token}`, 
                    "Content-Type": "application/json"
                }
            })
            if (res.ok) {
                navigate(`/`)
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
                    <button onClick={() => navigate(-1)}>go back</button>
                    <div className="group-image-container">
                        <img src={conv.avatarURL ?? '/public/user.jpg'} className="group-avatar" />
                        {conv.isAdmin 
                            && <form onSubmit={handleAvatar}>
                                    <input 
                                        type="file" 
                                        name="avatar"
                                        accept="image/jpg, image/png, image/webp"
                                        onChange={e => setFile(e.target.files[0])}
                                    />
                                    <button type="submit">upload</button>
                                </form>
                        }
                    </div>
                    <h2>{conv.name ?? "Group name doesn't exist"}</h2>
                    <p>Created at: {conv.createdAt}</p>
                    <div className="member-container">
                        <h2>Members</h2>
                        <div className="member-div">
                            {conv.participants.map( p => (
                                <div className="member-card">
                                    <h4>{p.user.username}</h4>
                                    <p>Role: {p.role}</p>
                                    {conv.isAdmin && p.role !== 'ADMIN' 
                                        && <button 
                                            onClick={() => makeAdmin(conv.id, p.user.id)}
                                            >
                                                Make admin
                                            </button>
                                    } 

                                    {conv.isAdmin 
                                        && <button 
                                            onClick={() => removeMember(conv.id, p.user.id)}
                                            >
                                                Remove
                                            </button>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="group-buttons">
                        {conv.isAdmin && <button onClick={() => deleteGroup(conv.id)}>
                            Delete group
                            </button>
                        } 
                    </div>
                </div>
            }
        </div>
    )
}

export default GroupDetail