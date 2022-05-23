import React from 'react';
import Board from '../components/Board';
import PropertiesSidebar from '../components/PropertiesSidebar';
import Toolbox from '../components/Toolbox/Toolbox';

function Home() {
  return (
    <div className="flex-1 min-h-0">
      <div className="grid md:grid-cols-12 h-full grid-rows-12">
        <Toolbox className="md:col-span-2 md:w-auto w-screen max-h-32 md:max-h-full border-b-4 md:border-r-4" />
        <Board className="md:col-span-7" />
        <PropertiesSidebar className="md:col-span-3" />
      </div>
    </div>
  );
}

export default Home;
