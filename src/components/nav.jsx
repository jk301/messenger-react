import { NavLink, Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import '../style/nav.css'

function Nav ({ logged, setLogged }) {
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
            <Link to='/'><h1>The nav</h1></Link>
            { logged 
                ? <div className="nav-but">
                    <Link to='/' >Home</Link>
                    <Link to='/friends' >Friends</Link>
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