import React from 'react';
import Board from '../components/Board';
import PropertiesSidebar from '../components/PropertiesSidebar';
import Toolbox from '../components/Toolbox';

function Home() {
  return (
    <main className="h-full flex flex-grow">
      <div className="grid grid-cols-12 h-full">
        <Toolbox className="col-span-2 overflow-y-auto" />
        <Board className="col-span-7" />
        <PropertiesSidebar className="col-span-3" />
      </div>
    </main>
  );
}

export default Home;
