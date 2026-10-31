import { useEffect, useRef, useState } from "react"

import '../style/profile.css'

function Profile ({ logged, profile, setProfile }) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

	const [newName, setNewName] = useState('')
	const [newEmail, setNewEmail] = useState('')
	const [newPass, setNewPass] = useState('')
	const [file, setFile] = useState(null)

	const fileInputRef = useRef(null)

	const [nameToggle, setNameToggle] = useState(false)
	const [emailToggle, setEmailToggle] = useState(false)
	const [passToggle, setPassToggle] = useState(false)

    useEffect( () => {
        (async () => {
			try {
				setLoading(true)
				const token = localStorage.getItem('token')
				const res = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
					headers: { Authorization: `Bearer ${token}` }
				})

				if (res.ok) {
					const data = await res.json()
                    setProfile(data.profile)
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
    },[logged, setProfile])

	async function handleAvatar (e) {
		e.preventDefault()
		try {
			setLoading(true)

			const formData = new FormData()
			formData.append('avatar', file)

			const token = localStorage.getItem('token')
			const res = await fetch(`${import.meta.env.VITE_API_URL}/profile/change/avatar`, {
				method: "PATCH", 
				headers: {
					Authorization: `Bearer ${token}`, 
				}, 
				body: formData
			})

			if (res.ok) {
				const data = await res.json()
				setProfile(data.updated)
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
			fileInputRef.current.value = ''
			setFile(null)
			setLoading(false)
			setNameToggle(false)
			setEmailToggle(false)
			setPassToggle(false)
		}
	}

	async function handleUsername (e) {
		e.preventDefault()
		try {
			setLoading(true)
			const token = localStorage.getItem('token')
			const res = await fetch(`${import.meta.env.VITE_API_URL}/profile/change/username`, {
				method: "PATCH", 
				headers: {
					Authorization: `Bearer ${token}`, 
					'Content-Type': 'application/json'
				}, 
				body: JSON.stringify({ username: newName })
			})

			if (res.ok) {
				const data = await res.json()
				setProfile(data.updated)
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
			setNameToggle(false)
			setEmailToggle(false)
			setPassToggle(false)
			setNewName('')
		}
	}


	async function handleEmail (e) {
		e.preventDefault()
		try {
			setLoading(true)
			const token = localStorage.getItem('token')
			const res = await fetch(`${import.meta.env.VITE_API_URL}/profile/change/email`, {
				method: "PATCH", 
				headers: {
					Authorization: `Bearer ${token}`, 
					'Content-Type': 'application/json'
				}, 
				body: JSON.stringify({ email: newEmail })
			})

			if (res.ok) {
				const data = await res.json()
				setProfile(data.updated)
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
			setNameToggle(false)
			setEmailToggle(false)
			setPassToggle(false)
			setNewEmail('')
		}
	}

	async function handlePassword (e) {
		e.preventDefault()
		try {
			setLoading(true)
			const token = localStorage.getItem('token')
			const res = await fetch(`${import.meta.env.VITE_API_URL}/profile/change/password`, {
				method: "PATCH", 
				headers: {
					Authorization: `Bearer ${token}`, 
					'Content-Type': 'application/json'
				}, 
				body: JSON.stringify({ password: newPass })
			})

			if (res.ok) {
				const data = await res.json()
				setProfile(data.updated)
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
			setNameToggle(false)
			setEmailToggle(false)
			setPassToggle(false)
			setNewPass('')
		}
	}


    if (!logged) return <div><h2>Need to be logged in to be able to see profile data</h2></div>
    if (error) return <div className="status"><h2>{error}</h2></div>

    return (
        <div className="profile">
            {loading 
                ? <h2>Fetching details</h2>
                : <div className="content">
					<div className="img-container">
						<img src={profile.avatarURL ?? '/user.jpg'} className="group-avatar" />
						<form onSubmit={handleAvatar}>
							{!file 
								&& <label htmlFor="file-input" className="file-label">
										<img 
											src="/public/attach.svg" 
											className="file-icon" 
											alt="attachment button" 
										/>
									</label>
                            }
							{!file && <p>Select a avatar to upload (jpg, png, webp)</p>} 
							<input 
								type="file" 
								id="file-input"
								name="avatar" 
								accept="image/jpg,image/png,image/webp" 
								onChange={e => setFile(e.target.files[0])}
								ref={fileInputRef}
							/>
							{file 
								&& <div className="file-name-cancel-container">
									<p>
										{file.name}
									</p>
									<button 
										onClick={() => { 
											setFile(null)  
											fileInputRef.current.value = ''
										}}
										>
											cancel
									</button> 
									<button type="submit">Upload</button>
								</div>
							}
						</form>
					</div>
					{nameToggle 
						? <div className="change-input">
								<form onSubmit={handleUsername}>
									<input 
										type="text" 
										value={newName} 
										onChange={e => setNewName(e.target.value)} 
										required 
										placeholder="new username here"
									/>
									<div className="change-input-but-div">	
										<button type="submit">Save changes</button>
										<button onClick={() => setNameToggle(false)}>cancel</button>
									</div>
									
								</form>
							</div>
						: <div className="detail">
								<h3>Username: {profile.username}</h3>
								<button onClick={() => setNameToggle(true)}>Change username</button>
							</div>
					}

					{emailToggle
						? <div className="change-input">
								<form onSubmit={handleEmail}>
									<input 
										type="email" 
										value={newEmail} 
										onChange={e => setNewEmail(e.target.value)} 
										required
										placeholder="new email here"
									/>
									<div className="change-input-but-div">
										<button type="submit">Save changes</button>
										<button onClick={() => setEmailToggle(false)}>cancel</button>
									</div>
								</form>
							</div>
						: <div className="detail">
								<h3>Email: {profile.email}</h3>
								<button onClick={() => setEmailToggle(true)}>Change email</button>
							</div>
					}

					{passToggle 
						? <div className="change-input">
								<form onSubmit={handlePassword}>
									<input 
										type="password" 
										value={newPass} 
										onChange={e => setNewPass(e.target.value)} 
										required
										placeholder="New password here"
									/>
									<div className="change-input-but-div">
										<button type="submit">Save changes</button>
										<button onClick={() => setPassToggle(false)}>cancel</button>
									</div>
								</form>
							</div>
						: <button 
								className="pass-btn" 
								onClick={() => setPassToggle(true)}
							>
								Change password
							</button>
							
					}
                    
					<button className="delete-btn">DELETE ACCOUNT</button>
                </div>
            }
        </div>
    )
}

export default Profile