import React, { useState } from "react";
import Cookies from "js-cookie";

const AddItem = ({ listId }) => {
  const [description, setDescription] = useState("");

  const addItem = async (description) => {
    if (!description) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Cookies.get("jwt"),
        },
        credentials: "include",
        body: JSON.stringify({ description, list_id: listId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      // No need to update the items state here, as it's in the Items component.

      setDescription("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    addItem(description);
  };

  return (
    <input
      type="text"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Add an item, then press enter"
      className="w-full px-3 py-2 mb-4 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
    />
  );
};

export default AddItem;
