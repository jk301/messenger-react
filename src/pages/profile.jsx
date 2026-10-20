import { useEffect, useState } from "react"

function Profile ({ logged }) {
    const [profile, setProfile] = useState(null)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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
    },[logged])


    if (!logged) return <div><h2>Need to be logged in to be able to see profile data</h2></div>
    if (error) return <div className="status"><h2>{error}</h2></div>

    return (
        <div className="profile">
            {loading 
                ? <h2>Fetching details</h2>
                : <div className="content">
                    <h2>{profile.username}</h2>
                    <p>{profile.email}</p>
                </div>
            }
        </div>
    )
}

export default Profile