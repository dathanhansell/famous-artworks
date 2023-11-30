import React, { useState, useEffect } from "react";
import axios from 'axios';

import ItemList from "../components/ItemList";

function TestPage() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    // Fetch data from API
    axios.get('http://localhost:3001/artworks/')
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  const handleItemClick = (item) => setSelectedItem(item);

  const deleteItem = (itemId) => {
    // delete item logic here
  }

  return (
    <div>
      <h1>Items</h1>
      <ItemList
        items={items}
        selectedItem={selectedItem}
        onItemSelect={handleItemClick}
        onDeleteItem={deleteItem}
      />
    </div>
  );
}

export default TestPage;
