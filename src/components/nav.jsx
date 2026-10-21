import { NavLink, Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import '../style/nav.css'

function Nav ({ logged, setLogged, profile }) {
    const navigate = useNavigate()
    function handleLogout () {
        if (!logged) {
            console.log('Not logged in.')
            return 
        }
        localStorage.removeItem("token")
        console.log('Token removed.')
        setLogged(false)
        navigate('/')
    }

    return (
        <nav>
            { profile 
                ? <Link to={`/profile`}>
                    <div className="profile-div">
                        <img 
                            src={profile.avatarURL} 
                            alt="profile avatar" 
                            className="avatar"
                        />
                        <h1>Hello {profile.username}</h1>
                    </div> 
                </Link>
                : <dir>
                    <h1>Hello there messenger</h1>
                </dir>
            }

            { logged 
                ? <div className="nav-but">
                    <Link to='/' >Home</Link>
                    <Link to='/friends' >Friends</Link>
                    <Link to='/search' >Search people</Link>
                    <button onClick={handleLogout} >Logout</button>
                </div>
                : <div className="nav-but">
                    <NavLink to='/register'>Sign up</NavLink>
                    <NavLink to='/login'>Login</NavLink>
                </div>
            }
        </nav>
    )
}

export default Nav