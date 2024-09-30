import React, { useEffect, useState } from "react";
import FoodCard from "../components/foodCard";
import Header from "../components/header";
import api from "../api";

function Home() {
  const [items, setItems] = useState([]);
  const [expiryDate, setExpiryDate] = useState("");

  const handleDelete = async (item) => {
    try {
      const res = await api.delete(`/items/${item.name}`);

      setItems(
        items.filter(function (e) {
          return e !== item;
        })
      );
    } catch (e) {
      console.log(e);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await api.get("/items", { params: { filterDate: expiryDate } });
      setItems(res.data.data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchItems();
  }, [expiryDate]);
  return (
    <>
      <Header title={"Fridge"} />
      <div className="px-2">
      <div className="relative my-4  max-w-sm flex items-baseline justify-between">
          <label className="pr-4">Expiry date </label>
          <input
            type="date"
            class=" bg-teal-100 px-4 py-2 rounded-lg"
            placeholder="Select date"
            onChange={(e) => setExpiryDate(e.target.value)}
          ></input>
        </div>
        
        {items.map((item) => (
          <div className="mt-2">
            <FoodCard item={item} onClickDelete={handleDelete} />
          </div>
        ))}
      </div>
    </>
  );
}


export default Home;
