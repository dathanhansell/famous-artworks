import React from 'react';
import axios from 'axios';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

class ArtworkList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artworks: []
    };
  }

  componentDidMount() {
    this.getArtworks();
  }

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
        { artworks.length === 0 ? (
            <p>No Artworks Found</p>
          ) : (
            artworks.map((artwork) => (
              <ListGroup className="mb-2" key={artwork.title}>
                <ListGroupItem variant="primary">
                  <h3>Title: {artwork.title}</h3>
                  <p>Artist: {artwork.artist}</p>
                  <p>Date of Completion: {artwork.dateOfCompletion}</p>
                  <p>Country of Artist: {artwork.country}</p>
                  <p>Style of Art: {artwork.style}</p>
                  <p>Current Location: {artwork.location}</p>
                </ListGroupItem>
              </ListGroup>
            ))
        )}
      </div>
    );
  }
}

export default ArtworkList;
