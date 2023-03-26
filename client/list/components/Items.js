import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const Items = ({ listId, isOwner, selectedUser }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, [listId]);

  const fetchItems = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/items/${listId}/${selectedUser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + Cookies.get("jwt"),
          },
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data);
      }

      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/deleteItem/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + Cookies.get("jwt"),
          },
          credentials: "include",
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      // Update the items state in the UI
      setItems(items.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleItemCompletion = async (itemId, completed) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updateItem`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Cookies.get("jwt"),
        },
        credentials: "include",
        body: JSON.stringify({ id: itemId, completed: !completed }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      // Update the items state in the UI
      setItems(
        items.map((item) =>
          item.id === itemId ? { ...item, completed: !completed } : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto ">
      <ul className="list-none p-0">
        {items.map((item) => (
          <li
            key={item.id}
            className="  p-1 rounded-lg flex items-center justify-between"
          >
            <div
              className={`flex items-center space-x-4 ${
                item.completed ? "line-through text-gray-500" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItemCompletion(item.id, item.completed)}
                className="form-checkbox h-5 w-5"
              />
              <span>{item.description}</span>
            </div>
            <button
              onClick={() => deleteItem(item.id)}
              className=" text-gray-500 font-medium px-4 py-1 shadow-md  bg-gray-100 rounded-md   hover:bg-gray-200 cursor-pointer transition-colors duration-200"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Items;
