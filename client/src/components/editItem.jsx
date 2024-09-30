import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

function EditItem() {
  const { id } = useParams();
  const [item, setItem] = useState({});

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/items/${id}`);
        setItem(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchItem();
  }, [id]);

  const [name, setName] = useState(item.name);
  const [expiryDate, setExpiryDate] = useState(item.expiryDate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/items/${id}`, { name, expiryDate });
      // Navigate back to the home page or do something else
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <h1>Edit Item</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Expiry Date:
          <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
        </label>
        <br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditItem;