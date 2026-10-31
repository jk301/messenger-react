import { NavLink, Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import '../style/nav.css'

function Nav ({ logged, setLogged, profile, setProfile }) {
    const navigate = useNavigate()
    function handleLogout () {
        if (!logged) {
            console.log('Not logged in.')
            return 
        }
        localStorage.removeItem("token")
        console.log('Token removed.')
        setLogged(false)
        setProfile(null)
        navigate('/')
    }

    return (
        <nav>
            { profile 
                ? <Link to={`/profile`}>
                    <div className="profile-div">
                        <img 
                            src={profile.avatarURL ?? '/public/user.jpg'} 
                            alt="profile avatar" 
                            className="avatar"
                        />
                        <h1>Hello {profile.username}</h1>
                    </div> 
                </Link>
                : <dir>
                    <h1>Hello</h1>
                </dir>
            }

            { logged 
                ? <div className="nav-but">
                    <NavLink to='/' >Home</NavLink>
                    <NavLink to='/friends' >Friends</NavLink>
                    <NavLink to='/search' >Search people</NavLink>
                    <button className="logout" onClick={handleLogout} >Logout</button>
                </div>
                : <div className="nav-but">
                    <NavLink to='/' >Home</NavLink>
                    <NavLink to='/register'>Sign up</NavLink>
                    <NavLink to='/login'>Login</NavLink>
                </div>
            }
        </nav>
    )
}

export default Nav