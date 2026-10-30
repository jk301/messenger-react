import { useEffect, useState, useRef } from "react"
import { Link, useParams } from "react-router-dom"
import { io } from "socket.io-client"

import { useContext } from "react"
import { PresenceContext } from "../App"

import '../style/viewConv.css'

function ViewConv({ logged, profile }) {
    const { convId } = useParams()
    const [conv, setConv] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const [message, setMessage] = useState('')

    const [file, setFile] = useState(null)
    const fileInputRef = useRef(null)

    const scrollRef = useRef(null)

    const onlineIds = useContext(PresenceContext)

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

    // socket message received
    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL, {
            auth: { token: localStorage.getItem('token') }
        })

        socket.on('newMessage', (msg) => {
            if (msg.convId !== convId) return 

            setConv( prev => {
                if (!prev) return 
                if (prev.messages.some( x => x.id === msg.id)) return prev
                return {
                    ...prev, 
                    messages: [
                        ...prev.messages, 
                        { ...msg, me: msg.senderId === profile.id }
                    ]}
            } ) 
        })

        socket.on('connect', () => console.log('socket connected', socket.id))

        return () => socket.disconnect()
    }, [convId, profile])
    
    useEffect(() => {
        const el = scrollRef.current
        if (el) el.scrollTop = el.scrollHeight
    }, [conv?.messages])

    async function handleUpload (e) {
        e.preventDefault()

        try {
            const formData = new FormData()
			formData.append('file', file)

            const token  = localStorage.getItem('token')
            const url = `${import.meta.env.VITE_API_URL}/conv/${convId}/file`
            const res = await fetch( url, {
                method: "POST", 
                headers: { 
                    Authorization: `Bearer ${token}`
                }, 
                body: formData
            })

            if (res.ok) {
                console.log('file sent successfully')
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
            setFile(null)
            fileInputRef.current.value = ''
        }
    }

    function downloadURL(url) {
        return url.replace('/upload/', '/upload/fl_attachment/')
    }

    async function handleMessage (e) {
        e.preventDefault()

        console.log('message state (inside handleMessage):', JSON.stringify(message))

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
                console.log('message sent successfully')
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
            setMessage('')
            console.log('message state (inside handleMessage):', JSON.stringify(message))
        }
    }


    if (!logged) {
        return <div className="status">You are not logged in OR unauthorized for this conversation</div>
    }
    if (loading) return <div className="status"><h2>Fetching conversations..</h2></div>
	if (error) return <div className="status"><h2>{error}</h2></div>

    console.log('message state:', JSON.stringify(message))

  return (
    <div className="in-conv-container">
        <div className="conv-detail-div">
            {conv.type === 'GROUP' 
                ? <Link to={`/conv/detail/${convId}`}>
                    <div className="conv-detail-bar">
                        {/* Group */}
                        <img 
                            src={conv.avatarURL ?? '/public/user.jpg'}
                            className="conv-main-avatars" 
                        />
                        <h2>{conv.name}</h2>
                    </div>
                </Link>
                : <div className="conv-detail-bar">
                     {/* direct conv */}
                    {/* profile pic here */}
                    <img 
                        src={conv.otherURL ?? '/public/user.jpg'}
                        className="conv-main-avatars" 
                    />
                    <h2>{conv.other}</h2>
                    {onlineIds.has(conv.otherId) 
                        ? <span className="online-dot" /> 
                        : <span className="online-dot-red" />
                    }
                </div>
            }
        </div>
        <div ref={scrollRef} className="messages">
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
                                {m.filePublicId 
                                    ? <a href={downloadURL(m.fileURL)}>{m.fileName}</a>
                                    : <p>{m.text}</p>
                                }
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
        <form className="message-input-form" onSubmit={ file ? handleUpload : handleMessage}>
            <input 
                type="file" 
                name="file" 
                onChange={e => setFile(e.target.files[0])}
                ref={fileInputRef}
            />
            {file 
                && <button 
                    onClick={() => { 
                        setFile(null)  
                        fileInputRef.current.value = ''
                    }}
                    >
                        cancel
                    </button>} 
            {!file 
                && <input 
                        value={message} 
                        onChange={e => setMessage(e.target.value)} 
                        id="message-input" 
                        placeholder="Message"
                    />
            }
            <button type="submit">Send</button>
        </form>
    </div>
  )
}

export default ViewConv