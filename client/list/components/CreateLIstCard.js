import React from "react";

const CreateListCard = ({ onCreateList }) => {
  const handleClick = () => {
    onCreateList();
  };

  return (
    <div
      className="flex items-center justify-center bg-gray-100 rounded-md  h-12 hover:bg-gray-200 cursor-pointer"
      onClick={handleClick}
    >
      <span className="text-gray-500 font-medium">Add a list</span>
    </div>
  );
};

export default CreateListCard;
