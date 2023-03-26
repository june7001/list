import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ListCard from "./ListCard";
import CreateListCard from "./CreateListCard";

const Lists = ({ selectedUser, isOwner }) => {
  const [lists, setLists] = useState([]);

  const fetchLists = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${selectedUser}/lists`,
        {
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
      const data = await res.json();

      setLists(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchLists();
    }
  }, [selectedUser]);

  const createList = async () => {
    const title = prompt("Enter the title of the new list:");
    if (!title) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/createList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Cookies.get("jwt"),
        },
        credentials: "include",
        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      const newList = await res.json();
      setLists([...lists, newList]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Lists</h2>

      {isOwner && (
        <div className="w-1/3 px-2">
          <CreateListCard onCreateList={createList} />
        </div>
      )}
      {lists.map((list) => (
        <div className="w-1/3 px-2" key={list.id}>
          <ListCard list={list} selectedUser={selectedUser} isOwner={isOwner} />
        </div>
      ))}
    </div>
  );
};

export default Lists;
