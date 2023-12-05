import {Link} from 'react-router-dom';
import Logo from '../assets/F.png';

const Navbar = () => {
    function toggleNavMenu() {
        const navbar = document.getElementById("sbTopnav");
        if (navbar.className === "topnav") {
            navbar.className = "navMenu";
        } else {
            navbar.className = "topnav";
        }
    }
    return (
        <div className="topnav" id="sbTopnav">
            <Link to="/" className="logoLink">
                <img src={Logo} className="siteLogo" alt="Study Buddy Logo button"></img>
            </Link>
            <Link to="/">
                Home
            </Link>
            <Link to="/Catalog">Catalog</Link>
            <Link to="/Create">
                Create
            </Link>
            <Link to="/Login" id="navMenu">Log in</Link>
            <Link to="/Register" id="navMenu">Register</Link>
            <div className="usernav">
                <Link to="/Register">Register</Link>
                <Link to="/Login">Log in</Link>
            </div>
            <button className="menubtn" onClick={toggleNavMenu}>☰</button>
        </div>
    );
};

export default Navbar;