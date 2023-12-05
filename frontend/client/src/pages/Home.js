import Logo from "../assets/FF_Logo.png";

const Home = () => {
    return (
        <div className="home">
            <div className="topDesign">
                <img src={Logo} className="topImage" alt="FF Logo"></img>
            </div>
        </div>
    );
};

export default Home;