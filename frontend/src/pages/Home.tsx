import React from 'react';
// import Board from '../components/Board';
import PropertiesSidebar from '../components/PropertiesSidebar';
import Toolbox from '../components/Toolbox';
import CreateBoardForm from '../components/api-test-components/CreateBoard';

function Home() {
  return (
    <div className="flex-1 min-h-0">
      <div className="grid grid-cols-12 h-full">
        <Toolbox className="col-span-2" />
        <CreateBoardForm className="col-span-7" />
        <PropertiesSidebar className="col-span-3" />
      </div>
    </div>
  );
}

export default Home;
