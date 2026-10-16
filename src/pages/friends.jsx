import { useEffect, useState } from "react"

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
    const [route, setRoute] = useState(`/friends`)

    const [friends, setFriends] = useState([])

	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		(async () => {
			try {
				setLoading(true)
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

	}, [logged, route, filter])

    function handleFilter () {
        if (filter === 'all') {
            setRoute('/friends')
        } else if (filter === 'sent') {
            setRoute('/friends/sent')
        } else if (filter === 'received') {
            setRoute('/friends/received')
        } else if (filter === 'rec_req_rej') {
            setRoute('/friends/rejected')
        } else if (filter === 'sent_req_rej') {
            setRoute('/friends/sent/rejected')
        }
    }

    if (!logged) {
        return <div className="status">You are not logged in OR unauthorized for this conversation</div>
    }

	if (loading) return <div className="status"><h2>Fetching conversations..</h2></div>
	if (error) return <div className="status"><h2>{error}</h2></div>
	

  return (
    <div className="friends">
        <div className="selector">
            <button 
                className={filter === 'all' && 'active-selector'}
                onClick={ () => {
                    setFilter('all')
                    handleFilter()
                }}
            >All Friends</button>
            <button 
                className={filter === 'sent' && 'active-selector'}
                onClick={() => {
                    setFilter('sent')
                    handleFilter()
                }} 
            >Sent requests</button>
            <button 
                className={filter === 'received' && 'active-selector'}
                onClick={() => {
                    setFilter('received')
                    handleFilter()
                }}
            >Received requests</button>
            <button 
                className={filter === 'rec_req_rej' && 'active-selector'}
                onClick={() => {
                    setFilter('rec_req_rej')
                    handleFilter()
                }}
            >Rejected requests(received)</button>
            <button 
                className={filter === 'sent_req_rej' && 'active-selector'}
                onClick={() => {
                    setFilter('sent_req_rej')
                    handleFilter()
                }}
            >Rejected requests(sent)</button>
        </div>
        {friends.length > 0 
            ? <div className="card-container">
                {friends.map( f => (
                    <div key={f.reqId} className="friend-card">
                        {/* profile pic here */}
                        <h3>{f.friend.username}</h3> 
                        <p>Status: {f.status}</p>
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