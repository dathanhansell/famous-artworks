import React from 'react';
import ArtworkForm from './components/ArtworkForm';
import ArtworkList from './components/ArtworkList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <div className="content">
            <div className="artwork-form">
              <h1>Add Artwork</h1>
              <ArtworkForm />
            </div>
            <div className="artwork-list">
              <h1>Current Artwork</h1>
              <ArtworkList />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;