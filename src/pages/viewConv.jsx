import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import '../style/viewConv.css'

function ViewConv({ logged }) {
    const { convId } = useParams()
    const [conv, setConv] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const [message, setMessage] = useState('')

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

    async function handleMessage (e) {
        e.preventDefault()

        try {
            const token = localStorage.getItem('token')
            const url = `${import.meta.env.VITE_API_URL}/conv/${convId}/message`
            const res = await fetch( url, {
                method: "POST", 
                headers: {
                    'Content-Type': 'application/json',  
                    Authorization: `Bearer ${token}`
                }, 
                body: JSON.stringify({ text: message })
            })

            if (res.ok) {
                const data = await res.json()
                console.log('message sent successfully')
                setConv(prev => ({...prev, messages: [...prev.messages, data.message]}))
                setMessage('')
            } else if (res.status === 401) {
                setError("Want to Start messaging? sign up & log in.")
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
    if (loading) return <div className="status"><h2>Fetching conversations..</h2></div>
	if (error) return <div className="status"><h2>{error}</h2></div>

    console.log(conv)
  return (
    <div className="conv-container">
        <div className="conv-detail-div">
            {conv.type === 'GROUP' 
                ? <Link to={`/conv/detail/${convId}`}>
                    <div className="conv-detail-bar">
                        {/* Group */}
                        <img 
                            src={conv.avatarURL ?? '/public/user.jpg'}
                            className="avatars" 
                        />
                        <h2>{conv.name}</h2>
                    </div>
                </Link>
                : <div className="conv-detail-bar">
                     {/* direct conv */}
                    {/* profile pic here */}
                    <img 
                        src={conv.otherURL ?? '/public/user.jpg'}
                        className="avatars" 
                    />
                    <h2>{conv.other}</h2>
                </div>
            }
        </div>
        <div className="messages">
            {conv.messages.length > 0 
                ? <div className="message-container">
                    {conv.messages.map( m => (
                        <div key={m.id} className={`message-card ${m.me ? "mine" : ''}`}>
                            {m.me 
                                ? '' 
                                : conv.type === 'DIRECT' 
                                    ? ''
                                    : <img 
                                        src={ m.sender.avatarURL ?? '/public/user.jpg'} 
                                        className="msg-avatars" 
                                    />
                            }
                            <div className="msg-text-detail">
                                <p>{m.text}</p>
                                {conv.type === 'DIRECT' 
                                    ? ''
                                    : <p>{m.sender?.username ?? "Deleted user"}</p>
                                }
                            </div>
                        </div>
                    ))}
                </div>
                : <div>
                    <p>No messages yet.</p>
                </div>
            }
        </div>
        <div className="input-div">
            <form onSubmit={handleMessage}>
                <textarea 
                    value={message} 
                    onChange={e => setMessage(e.target.value)} 
                    id="message-input" 
                />
                <button type="submit">Send</button>
            </form>
        </div>
    </div>
  )
}

export default ViewConv