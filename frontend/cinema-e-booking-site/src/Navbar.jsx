import './Navbar.css';
function Navbar(){
    return(
        <header>
            <nav>
                <ul className="flex-list">
                    <div className="logo">
                        <li><img src="./assets/react.svg" alt="Logo Placeholder"></img></li>
                        <li>Title Placeholder</li>
                    </div>
                    <li><a href="#">Showtimes</a></li>
                    <li><a href="#">Promotions</a></li>
                    <li><a href="#">Contact Us</a></li>
                    <li><a href="#">Sign In</a></li>
                </ul>
            </nav>
            <hr></hr>
        </header>
    );
}

export default Navbar