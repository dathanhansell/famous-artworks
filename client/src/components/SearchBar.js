import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import './SearchBar.css';

const SearchBar = ({ onSuggestionSelected }) => {
    const [searchText, setSearchText] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const loadSuggestions = useRef(debounce((searchText) => {
        if (searchText.length > 2) {
            setIsLoading(true);
            axios.get(`/artists/search?text=${searchText}`)
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setSuggestions(res.data);
                    } else {
                        console.error('Data received from API is not an array:', res.data);
                        setSuggestions([]);
                    }
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setSuggestions([]);
                    setIsLoading(false);
                });
        } else {
            setSuggestions([]);
        }
    }, 300)).current;

    useEffect(() => {
        loadSuggestions(searchText);
    }, [searchText]);

    const handleChange = event => {
        setSearchText(event.target.value);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchText(suggestion.name);
        setSuggestions([]);
        onSuggestionSelected && onSuggestionSelected(suggestion);
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                value={searchText}
                onChange={handleChange}
                onFocus={() => setIsActive(true)}
                onBlur={() => setIsActive(false)}
                placeholder="Search artists..."
                className="search-input"
            />
            {isLoading && isActive ? <div className="loading">Loading...</div> : null}
            {isActive &&
                <div className="suggestions">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            onMouseDown={() => handleSuggestionClick(suggestion)}
                            className="suggestion-item"
                        >
                            {suggestion.name}
                        </div>
                    ))}
                </div>
            }
        </div>
    );
};

export default SearchBar;
