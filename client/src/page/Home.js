import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import { FormControl, Select, MenuItem, InputLabel, Grid, Button } from '@material-ui/core';
import { loadSortedData, loadWithMost, getTotalCount,loadAvg,getYoungestArtist } from '../dbOperations';

function HomePage() {
    const [recentArtists, setRecentArtists] = useState([]);
    const [table1WithMosttable2, setMuseumsWithCollectors] = useState([]);
    const [artworkCount, setArtworkCount] = useState([]);
    const [artistCount, setArtistCount] = useState([]);
    const [youngestArtist, setYoungestArtist] = useState([]);
    const [table2table1Avg, setMuseumAvg] = useState([]);
    const [table1, setTable1] = useState("");
    const [table2, setTable2] = useState("");
    const handleChangeTable1 = (event) => {
        setTable1(event.target.value);
    };

    const handleChangeTable2 = (event) => {
        setTable2(event.target.value);
    };

    const tables = ["artists", "artworks", "museums", "art_periods", "art_styles", "collectors"];

    useEffect(() => {
        // Fetch the last 5 artists added
        loadSortedData('artists', setRecentArtists, 'id', 'DESC', 5);
        loadWithMost(table1, table2, setMuseumsWithCollectors, 5);
        getTotalCount('artworks', setArtworkCount);
        getTotalCount('artists', setArtistCount);
        loadAvg(table1, table2, setMuseumAvg);
        getYoungestArtist(setYoungestArtist);
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
                                        <MenuItem key={table} value={table}>{table.charAt(0).toUpperCase() + table.slice(1)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl variant="filled" fullWidth>
                                <InputLabel>Table</InputLabel>
                                <Select value={table2} onChange={handleChangeTable2}>
                                    {tables.filter(table => table !== table1).map(table => (
                                        <MenuItem key={table} value={table}>{table.charAt(0).toUpperCase() + table.slice(1)}</MenuItem>
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
                    <h2>{table1} Sorted by Most {table2}</h2>
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
                    <h2>Average   {table2} related to {table1}</h2>
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


            </div>
        </div>
    );
}

export default HomePage;
