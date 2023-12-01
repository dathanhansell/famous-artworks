import React, { Component } from "react";
import axios from "axios";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
  Fab,
} from "@mui/material"; // Material UI
import AddIcon from "@mui/icons-material/Add";

class ArtworkList extends Component {
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
        this.props.onDeleteArtwork();
      })
      .catch((error) => {
        console.error(`Error deleting artwork: ${error}`);
      });
  };

  updateArtwork = (id, data) => {
    console.log(`Updating "${id}"`);
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
    const { selectedArtwork } = this.props;
    return (
      <div style={{ display: "flex", flexFlow: "column", gap: 8, padding: 10 }}>
        <h1>List of Artworks</h1>
        {artworks.length === 0 ? (
          <p>No Artworks Found</p>
        ) : (
          artworks.map((artwork) => (
            <List
              style={{
                padding: 0,
                boxShadow: "none",
                borderRadius: 50,
                border: "0.5px solid #ede7e8",
              }}
              key={artwork.title}
              component={Paper}
              className="mb-2"
            >
              <ListItem
                style={{
                  backgroundColor:
                    selectedArtwork && selectedArtwork.id === artwork.id
                      ? "#DDDDDD"
                      : "",
                  borderRadius: 50,
                }}
                onClick={() => this.props.onArtworkClick(artwork)}
              >
                <ListItemText primary={<h3>Title: {artwork.title}</h3>} />
                <ListItemText primary={`id: ${artwork.id}`} />
                <ListItemText primary={`Year: ${artwork.year}`} />
                <ListItemText primary={`Medium: ${artwork.medium}`} />
                <Button onClick={() => this.deleteArtwork(artwork.id)}>
                  Delete
                </Button>
              </ListItem>
            </List>
          ))
        )}
        <Fab
          style={{ margin: 10, alignSelf: "flex-end" }}
          color="primary"
          aria-label="add"
          onClick={() => this.props.onArtworkClick(null)}
        >
          <AddIcon />
        </Fab>
      </div>
    );
  }
}

export default ArtworkList;
