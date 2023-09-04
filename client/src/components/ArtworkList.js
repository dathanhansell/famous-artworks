import React from "react";
import axios from "axios";
import { ListGroup, ListGroupItem, Button } from "react-bootstrap";

class ArtworkList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artworks: [],
    };
  }

  componentDidMount() {
    this.getArtworks();
  }

  getArtworks = () => {
    axios
      .get("http://localhost:3001/artworks")
      .then((res) => {
        const artworks = res.data;
        this.setState({ artworks });
      })
      .catch((error) => {
        console.error(`Error fetching data: ${error}`);
      });
  };
  deleteArtwork = (id) => {
    axios
      .delete(`http://localhost:3001/artworks/${id}`)
      .then(() => {
        this.getArtworks();
        this.props.onDeleteArtwork(); // Clean selection after deleting
      })
      .catch((error) => {
        console.error(`Error deleting artwork: ${error}`);
      });
  };

  updateArtwork = (id, data) => {
    console.log(`"updating "${id}`)
    axios
      .put(`http://localhost:3001/artworks/${id}`, data)
      .then(() => {
        this.getArtworks();
      })
      .catch((error) => {
        console.error(`Error updating artwork: ${error}`);
      });
  };
  render() {
    const { artworks } = this.state;
    return (
      <div>
        <h2>List of Artworks</h2>
        <ListGroup className="mb-2">
              <ListGroupItem
                variant="primary"
                onClick={() => this.props.onArtworkClick(null)}
              ><h3>New Artwork</h3></ListGroupItem>
            </ListGroup>
        {artworks.length === 0 ? (
          <p>No Artworks Found</p>
        ) : (
          artworks.map((artwork) => (
            <ListGroup className="mb-2" key={artwork.title}>
              <ListGroupItem
                variant="primary"
                onClick={() => this.props.onArtworkClick(artwork)}
              >
                <h3>Title: {artwork.title}</h3>
                <p>id: {artwork.id}</p>
                <p>Artist: {artwork.artist}</p>
                <p>Date of Completion: {artwork.dateOfCompletion}</p>
                <p>Country of Artist: {artwork.country}</p>
                <p>Style of Art: {artwork.style}</p>
                <p>Current Location: {artwork.location}</p>
                <Button onClick={() => this.deleteArtwork(artwork.id)}>
                  Delete
                </Button>
              </ListGroupItem>
            </ListGroup>
          ))
        )}
      </div>
    );
  }
}

export default ArtworkList;
