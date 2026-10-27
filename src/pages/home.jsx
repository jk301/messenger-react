import { useEffect, useState } from "react"

import '../style/home.css'
import { Link } from "react-router-dom"

function Home({ logged, profile }) {
	const [allConv, setAllConv] = useState([])
	const [showConv, setShowConv] = useState([])
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(null)

	const [filter, setFilter] = useState('all')

	useEffect(() => {
		if (filter === 'direct') {
			const newConv = allConv.filter( c => c.type === 'DIRECT' )
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setShowConv(newConv)
		} else if (filter === 'group') {
			const newConv = allConv.filter( c => c.type === 'GROUP' )
			setShowConv(newConv)
		} else if (filter === 'all') {
			setShowConv(allConv)
		}
	}, [filter, allConv])

  
	useEffect(() => {
		(async () => {
			try {
				setLoading(true)
				const token = localStorage.getItem('token')
				const res = await fetch(`${import.meta.env.VITE_API_URL}/conv`, {
					headers: { Authorization: `Bearer ${token}` }
				})

				if (res.ok) {
					const data = await res.json()
					setAllConv(data.conv)
					setShowConv(data.conv)
					console.log(data.conv)
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

	}, [logged])

	if (loading) return <div className="status"><h2>Fetching conversations..</h2></div>
	if (error) return <div className="status"><h2>{error}</h2></div>
	

  return (
    <div className="post-container">
        {logged 
			? <div className="post-content">
				<div className="conv-selector">
					<h1 
						onClick={() => { setFilter('all') }}
						className={filter === 'all' ? 'active-filter' : 'filter'}
					>All</h1>
					<h1 
						onClick={() => { setFilter('direct') }}
						className={filter === 'direct' ? 'active-filter' : 'filter'}
					>Direct</h1>
					<h1 
						onClick={() => { setFilter('group') }}
						className={filter === 'group' ? 'active-filter' : 'filter'}
					>Groups</h1>
				</div>
				<div className="conv-container">
					{showConv.length > 0 
						? showConv.map( conv => (
							<Link to={`conv/${conv.id}`}>
								<div key={conv.id} className="conv-card">
									{/* // profile image here maybe ? */}
									<img 
										src={conv.avatarURL 
												? conv.avatarURL
												: conv.otherURL 
													? conv.otherURL
													: '/public/user.jpg'
											} 
										className="home-avatars" 
									/>
									{ conv.type === 'GROUP' 
										? <div>
												<h3>{conv.name}</h3> 
												<p>{conv.messages[0]?.text 
													? profile.username === conv.messages[0].sender.username
														? <span>You: {conv.messages[0].text}</span>
														: <span>
															{conv.messages[0].sender.username}: {conv.messages[0].text}
															</span>
													: conv.messages[0]?.fileName 
														? <span>
															{conv.messages[0].sender.username}: {conv.messages[0].fileName}
														</span>
														: 'No messages'
												}</p>
											</div>
										: <div>
												<h3>{conv.other}</h3>
												<p>{conv.messages[0]?.text 
													? profile.username === conv.messages[0].sender.username
														? <span>You: {conv.messages[0].text}</span>
														: <span>
															{conv.messages[0].sender.username}: {conv.messages[0].text}
															</span>
													: conv.messages[0]?.fileName 
														? profile.username === conv.messages[0].sender.username 
															? <span>
																You: {conv.messages[0].fileName}
															</span>
															: <span>
																{conv.messages[0].sender.username}: {conv.messages[0].fileName}
															</span>
													: 'No messages'
												}</p>
											</div> 
										}
								</div>
							</Link>
						))
						: <h2>Nothing here</h2>
					}
					
				</div>
				<div className="start-conv-button">
					<Link to={`/friends`}><button>Start a Conversatione</button></Link>
					<Link to={`/create/group`}><button>Create a group</button></Link>
				</div>
			</div>
			
			: <h1>Placeholder text (not logged in)</h1>
		}
    </div>
  )
}

export default Home