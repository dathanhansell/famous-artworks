import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function HomePage() {
    const [recentArtists, setRecentArtists] = useState([]);
    const [collectorsWithMostWorks, setMuseumsWithCollectors] = useState([]);
    const [artworkCount, setArtworkCount] = useState([]);
    const [artistCount, setArtistCount] = useState([]);
    const [museumAvg, setMuseumAvg] = useState([]);
    useEffect(() => {
        // Fetch the last 5 artists added
        axios.get('http://localhost:3001/artists?sort=id&direction=DESC&limit=5')
            .then((response) => {
                setRecentArtists(response.data.data);
            })
            .catch((error) => {
                console.error(`Error fetching artists: ${error}`);
            });

        // Fetch the museums with collectors who have the most artworks
        axios.get('http://localhost:3001/collectors/most_artworks') // Adjust the URL as needed
            .then((response) => {
                setMuseumsWithCollectors(response.data);
            })
            .catch((error) => {
                console.error(`Error fetching museums: ${error}`);
            });
        axios.get('http://localhost:3001/artworks/api/count') // Adjust the URL as needed
            .then((response) => {
                setArtworkCount(response.data);
            })
            .catch((error) => {
                console.error(`Error fetching museums: ${error}`);
            });
        axios.get('http://localhost:3001/artists/api/count') // Adjust the URL as needed
            .then((response) => {
                setArtistCount(response.data);
            })
            .catch((error) => {
                console.error(`Error fetching museums: ${error}`);
            });
            axios.get('http://localhost:3001/museums/avg_artworks') // Adjust the URL as needed
            .then((response) => {
                setMuseumAvg(response.data);
            })
            .catch((error) => {
                console.error(`Error fetching museums: ${error}`);
            });
    }, []);

    return (
        <div className="home">
            <h1 className="home__title">Famous Artworks</h1>
            <div className="home__grid">
                <div className="home__grid__item">
                    <h2>Scrum Operations</h2>
                    <ul>
                        <li><Link to="/db">Add, Update, Remove All Data</Link></li>
                    </ul>
                </div>
                <div className="home__grid__item">
                    <h2>Relations</h2>
                    <ul>
                        <li><Link to="/search">Search with direct and indirect relations</Link></li>
                    </ul>
                </div>
                <div className="home__grid__item">
                    <h2>Latest Artists</h2>
                    <ul>
                        {recentArtists.map((artist) => (
                            <p key={artist.id}>{artist.name}</p>
                        ))}
                    </ul>
                </div>
                <div className="home__grid__item">
                    <h2>Collectors Sorted by Most Artworks</h2>
                    <ul>
                        {collectorsWithMostWorks.map((museum, index) => (
                            <li key={index}>{museum.name} - {museum.count} artworks</li>
                        ))}
                    </ul>
                </div>
                <div className="home__grid__item">
                    <h2>Total Artwork and Artist count</h2>
                    <ul>
                        <li>{artworkCount.count} artworks</li>
                        <li>{artistCount.count} artists</li>
                    </ul>
                </div>
                <div className="home__grid__item">
                    <h2>Total Artwork and Artist count</h2>
                    <ul>
                        <li>{museumAvg.average} artworks</li>
                    </ul>
                </div>

            </div>
        </div>
    );
}

export default HomePage;
