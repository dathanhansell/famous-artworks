import React from 'react';
import axios from 'axios';

class ArtworkList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artworks: []
    };
  }
   
  // Fetch artworks on first mount
  componentDidMount() {
    this.getArtworks();
  }

  // Retrieves the list of artworks from the Express app
  getArtworks = () => {
    axios.get('http://localhost:3001/artworks')
      .then(res => {
        const artworks = res.data;
        this.setState({ artworks });
      })
      .catch((error) => {
        console.error(`Error fetching data: ${error}`);
      });
  }

  render() {
    const { artworks } = this.state;
    return (
      <div>
        <h2>List of Artworks</h2>
        {!artworks.length ? (
          <div>
            <h4>No Artworks Found</h4>
          </div>
        ) : (
          <div>
            {artworks.map((artwork) => (
              <div key={artwork.name}>
                <h3>Name: {artwork.name}</h3>
                <p>Description: {artwork.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default ArtworkList;
