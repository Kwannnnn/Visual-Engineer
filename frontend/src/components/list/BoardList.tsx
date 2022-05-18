import React from 'react';
import axios from 'axios';

function BoardList() {
  const getBoards = () => {
    axios.get('http://localhost:3000/api/v1/boards')
      .then((response) => {
        console.log(response);
      });
  };

  return (
    <div>
      <h1> List of items: </h1>
      <button type="button" onClick={getBoards}>Boards</button>
    </div>
  );
}

export default BoardList;
