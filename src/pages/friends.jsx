import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import '../style/friend.css'

// indexRouter.get('/users/search', searchUsers)
// indexRouter.get('/friends', getAllFriends)
// indexRouter.get('/friends/sent', getAllSentReq)
// indexRouter.get('/friends/received',  getAllfriendReq)
// indexRouter.get('/friends/rejected', getFriendsRejected)
// indexRouter.get('/friends/sent/rejected', getSentRejected)

// indexRouter.post('/friend/:receiverId/request', sendFriendReq)
// indexRouter.post('/friend/:reqId/accept', acceptReq)
// indexRouter.post('/friend/:reqId/reject', rejectReq)
// indexRouter.post('/friend/:reqId/remove', removeFriend)

function Friends({ logged }) {
    const [filter, setFilter] = useState('all')

    const [friends, setFriends] = useState([])

	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

	useEffect(() => {
        function handleRoute () {
            if (filter === 'all') {
                return '/friends'
            } else if (filter === 'sent') {
                return '/friends/sent'
            } else if (filter === 'received') {
                return '/friends/received'
            } else if (filter === 'rec_req_rej') {
                return '/friends/rejected'
            } else if (filter === 'sent_req_rej') {
                return '/friends/sent/rejected'
            }
        }

		(async () => {
			try {
				setLoading(true)
                const route = handleRoute(filter)
				const token = localStorage.getItem('token')
				const res = await fetch(`${import.meta.env.VITE_API_URL}${route}`, {
                    'Content-Type': 'application/json',
					headers: { Authorization: `Bearer ${token}` }
				})

				if (res.ok) {
					const data = await res.json()
					console.log(data.friends)
                    setFriends(data.friends)
				} else if (res.status === 401) {
					setError("Log in to see/add friends.")
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

	}, [logged, filter])

    async function handleFriend (action, userId) {
        try {
            let url = `${import.meta.env.VITE_API_URL}/friend/${userId}/${action}`
            const token = localStorage.getItem('token')
            const res = await fetch( url, {
                method: "POST", 
                'Content-Type': 'application/json',
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.ok) {
                window.location.reload()
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

    async function startConv (userId) {
        // /conv/direct/create/:userId
        try {
            let url = `${import.meta.env.VITE_API_URL}/conv/direct/create/${userId}`
            const token = localStorage.getItem('token')
            const res = await fetch( url, {
                method: "POST", 
                'Content-Type': 'application/json',
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.ok) {
                const data = await res.json()
                const conv = data.conv
                console.log(conv)
                navigate(`/conv/${conv.id}`)
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
    <div className="friends">
        <div className="selector">
            <button 
                className={filter === 'all' ? 'active-selector' : ''}
                onClick={ () => {setFilter('all')}}
            >All Friends</button>
            <button 
                className={filter === 'sent' ? 'active-selector' : ''}
                onClick={() => {setFilter('sent')}} 
            >Sent requests</button>
            <button 
                className={filter === 'received' ? 'active-selector' : ''}
                onClick={() => {setFilter('received')}}
            >Received requests</button>
            <button 
                className={filter === 'rec_req_rej' ? 'active-selector' : ''}
                onClick={() => {setFilter('rec_req_rej')}}
            >Rejected requests(received)</button>
            <button 
                className={filter === 'sent_req_rej' ? 'active-selector' : ''}
                onClick={() => {setFilter('sent_req_rej')}}
            >Rejected requests(sent)</button>
        </div>
        {loading 
            ? <div className="status"><h2>Fetching friends..</h2></div>
            : friends.length > 0 
            ? <div className="card-container">
                {friends.map( f => (
                    <div key={f.reqId} className="friend-card">
                        {/* profile pic here */}
                        <h3>{f.friend.username}</h3> 
                        <p>Status: {f.status}</p>
                        <div className="card-button-container">
                            {filter === 'all' 
                                && <button onClick={() => startConv(f.friend.id)}>Start chatting</button>
                            }
                            {filter === 'received' 
                                && <button onClick={() => handleFriend('accept', f.reqId)}>Accept</button>
                            }
                            {filter === 'received' 
                                && <button onClick={() => handleFriend('reject', f.reqId)}>Reject</button>
                                }
                            {filter !== 'sent_req_rej' 
                                && <button onClick={() => handleFriend('remove', f.reqId)}>Remove</button>
                            }
                        </div>
                    </div>
                ))}
            </div>
            : <div>
                <h3>Nobody here...</h3>
            </div>
        }
    </div>
  )
}

export default Friends