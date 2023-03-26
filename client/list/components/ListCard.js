import React from "react";
import Items from "./Items";
import AddItem from "./AddItem";

const ListCard = ({ list, isOwner, selectedUser }) => {
  return (
    <div>
      <h3 className="text-xl font-bold my-3">{list.title}</h3>
      {isOwner && <AddItem listId={list.id} />}
      <Items listId={list.id} selectedUser={selectedUser} />
    </div>
  );
};

export default ListCard;
