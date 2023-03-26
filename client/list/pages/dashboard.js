import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import FriendList from "../components/FriendList";
import Lists from "../components/Lists";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

async function fetchUserData(userId) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!response.ok) {
      const data = await response.json();
      throw new Error("Failed to fetch user data");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("jwt");

    if (!token) {
      router.push("/login");
      return;
    }
    const decoded = jwt_decode(token);
    const userId = decoded.id;
    fetchUserData(userId)
      .then((result) => {
        console.log("result", result);
        setUser(result);
        setSelectedUser(result.username);
      })

      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 flex">
      {loading ? (
        <div>Loading...</div>
      ) : (
        user && (
          <>
            <div className="w-1/4">
              <h2 className="text-2xl font-bold mb-4">
                Hej {user.username} :{")"}
              </h2>

              <FriendList setSelectedUser={setSelectedUser} />
            </div>

            <div className="w-3/4 pl-8">
              <Lists
                selectedUser={selectedUser}
                isOwner={selectedUser === user.username}
              />
            </div>
          </>
        )
      )}
    </div>
  );
};
export default Dashboard;
