import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function HomePage() {
    return (
        <div className="home">
            <h1 className="home__title">Famous Artworks</h1>
            <div className="home__grid">
                <div className="home__grid__item">
                    <h2>Scrum Operations</h2>
                    <ul>
                        <li><Link to="/test">Add, Update, Remove Artworks</Link></li>
                    </ul>
                </div>
                <div className="home__grid__item">
                    <h2>Direct Relations</h2>
                    <ul>
                        <li><Link to="/artonartist">All Artworks From Artist</Link></li>
                    </ul>
                </div>
                <div className="home__grid__item">
                    <h2>Indirect Relations</h2>
                    <ul>
                        <li><Link to="/artonmuseum">Artists Exhibited in a Museum</Link></li>
                    </ul>
                </div>
                <div className="home__grid__item">
                    <h2>Auth</h2>
                    <ul>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
