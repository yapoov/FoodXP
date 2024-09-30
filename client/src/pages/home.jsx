import React, { useEffect, useState } from "react";
import FoodCard from "../components/foodCard";
import Header from "../components/header";
import api from "../api";

function Home() {
  const [items, setItems] = useState([]);
  const [expiryDate, setExpiryDate] = useState("");

  const handleDelete = async (item) => {
    try {
      const res = await api.delete(`/items/${item._id}`);
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
      const res = await api.get("/items", {
        params: { filterDate: expiryDate },
      });
      const sorted = res.data.data.sort((a, b) => {
        return new Date(a.expiryDate) - new Date(b.expiryDate);
      });
      setItems(sorted);
    } catch (e) {}
  };

  useEffect(() => {
    fetchItems();
  }, [expiryDate]);
  return (
    <div className="w-full">
      <Header title={"Items"} />
      <div className="px-2">
        <div className="relative my-4  flex items-baseline justify-between">
          <input
            type="date"
            class=" bg-teal-100 px-4 py-2 rounded-lg"
            placeholder="Select date"
            onChange={(e) => setExpiryDate(e.target.value)}
          ></input>
        </div>
        {items.length > 0 ? (
          items.map((item) => (
            <div className="mt-2">
              <FoodCard item={item} onClickDelete={handleDelete} />
            </div>
          ))
        ) : (
          <div className="text-lg text-gray-200 font-bold text-center flex-grow">
            No items
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
