import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import { FormControl, Select, MenuItem, InputLabel, Grid, Button } from '@material-ui/core';
import { loadSortedData, loadWithMost, getTotalCount,loadAvg,loadMuseumsByArtPeriod,getLowestValue,getMostCommonValue } from '../dbOperations';

function HomePage() {
    const [recentArtists, setRecentArtists] = useState([]);
    const [table1WithMosttable2, setMuseumsWithCollectors] = useState([]);
    const [artworkCount, setArtworkCount] = useState([]);
    const [artistCount, setArtistCount] = useState([]);
    const [youngestArtist, setYoungestArtist] = useState([]);
    const [table2table1Avg, setMuseumAvg] = useState([]);
    const [museumsWithRenaissanceArt, setMuseumsWithRenaissanceArt] = useState([]);
    const [table1, setTable1] = useState("artists");
    const [table2, setTable2] = useState("artworks");
    const [bd, setBd] = useState("");
    const [medium, setMedium] = useState("");
    const handleChangeTable1 = (event) => {
        setTable1(event.target.value);
    };

    const handleChangeTable2 = (event) => {
        setTable2(event.target.value);
    };

    const tables = ["artists", "artworks", "museums", "art_periods", "art_styles", "collectors"];
    const toUp = (str) =>{
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    useEffect(() => {
        // Fetch the last 5 artists added
        loadSortedData('artists', setRecentArtists, 'id', 'DESC', 5);
        loadWithMost(table1, table2, setMuseumsWithCollectors, 5);
        loadMuseumsByArtPeriod(1, setMuseumsWithRenaissanceArt); 
        getTotalCount('artworks', setArtworkCount);
        getTotalCount('artists', setArtistCount);
        loadAvg(table1, table2, setMuseumAvg);
        getLowestValue(setYoungestArtist,"birthdate","artists");
        getMostCommonValue(setBd,'birthdate','artists');
        getMostCommonValue(setMedium,'medium','artworks');
    }, [table1, table2]);

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
                    <h2>Tables</h2>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={6}>
                            <FormControl variant="filled" fullWidth>
                                <InputLabel>Table</InputLabel>
                                <Select value={table1} onChange={handleChangeTable1}>
                                    {tables.filter(table => table !== table2).map(table => (
                                        <MenuItem key={table} value={table}>{toUp(table)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl variant="filled" fullWidth>
                                <InputLabel>Table</InputLabel>
                                <Select value={table2} onChange={handleChangeTable2}>
                                    {tables.filter(table => table !== table1).map(table => (
                                        <MenuItem key={table} value={table}>{toUp(table)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </div>

                <div className="home__grid__item">
                    <h2>Latest Artists</h2>
                    <ul>
                        {recentArtists && recentArtists.map((artist) => (
                            <p key={artist.id}>{artist.name}</p>
                        ))}

                    </ul>
                </div>
                <div className="home__grid__item">
                    <h2>Most Common Medium</h2>
                    <ul>
                        <li>{medium}</li>
                    </ul>
                </div>
                <div className="home__grid__item">
            <h2>Museums with Renaissance Art Sorted by Location DESC</h2>
            <ul>
                {museumsWithRenaissanceArt && museumsWithRenaissanceArt.map((museum) => (
                    <li key={museum.id}>{museum.name} - {museum.location}</li>
                ))}
            </ul>
        </div>
                <div className="home__grid__item">
                    <h2>{toUp(table1)} Sorted by Most {toUp(table2)}</h2>
                    <ul>
                        {table1WithMosttable2 && table1WithMosttable2.map((museum, index) => (
                            <li key={index}>{museum.name} - {museum.count} {table2}</li>
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
                    <h2>Average   {toUp(table2)} related to {toUp(table1)}</h2>
                    <ul>
                        <li>{table2table1Avg.average} {table2}</li>
                    </ul>
                </div>
                <div className="home__grid__item">
                    <h2>Youngest artist</h2>
                    <ul>
                        <li>{youngestArtist.name} {youngestArtist.birthdate}</li>
                    </ul>
                </div>
                <div className="home__grid__item">
                    <h2>Most Common Birthdate</h2>
                    <ul>
                        <li>{bd}</li>
                    </ul>
                </div>

            </div>          
        </div>  
    );
}

export default HomePage;
