import React from 'react';
import ArtworkForm from './ArtworkForm';
import ArtworkList from './ArtworkList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Add Artwork</h1>
        <ArtworkForm />
        <h1>Current Artwork</h1>
        <ArtworkList />
      </header>
    </div>
  );
}

export default App;
