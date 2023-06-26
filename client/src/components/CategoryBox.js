import React, { useState } from "react";

function CategoryBox({ onClick, category, isSelected }) {
  return (
    <div
      className={`p-2 rounded-lg ${
        !isSelected ? "bg-green-500" : "bg-green-800"
      } mr-2 my-2`}
      onClick={() => onClick(category._id)}
    >
      {category.title}
    </div>
  );
}

export default CategoryBox;
