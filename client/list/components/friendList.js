import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const FriendList = ({ setSelectedUser }) => {
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const addFriend = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/addFriend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + Cookies.get("jwt"),
          },
          credentials: "include",
          body: JSON.stringify({ username: search }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      setSearch("");
      fetchFriends();
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };
  const fetchFriends = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/friends",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + Cookies.get("jwt"),
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      const data = await response.json();
      setFriends(data.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };
  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Friends</h2>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Friend's username"
      />
      <button onClick={addFriend}>Add Friend</button>
      <ul>
        {friends.map((friend) => (
          <li
            className={`${
              selectedFriend === friend.username ? "font-bold" : ""
            }`}
            key={friend.id}
            onClick={() => {
              setSelectedUser(friend.username);
              setSelectedFriend(friend.username);
            }}
          >
            <span>{friend.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;
