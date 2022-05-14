import React, { useState } from 'react';
import './App.css';
import Button from './components/Button';
import Container from './components/Container';
import DBItemContainer from './components/DBItemContainer';

interface Item {
  Tag: string,
  DescriptiveName: string,
  Length: number,
  Width: number,
  Depth: number,
  Diameter: number,
}

function App() {
  const [data, setData] = useState<Item[]>([]);

  const json = [
    {
      Tag: '#583FA293D3',
      DescriptiveName: 'Cleaner',
      Length: 2.52,
      Width: 2.35,
      Depth: 1.47,
      Diameter: 1.79,
    },
    {
      Tag: '#7A52B98F2C',
      DescriptiveName: 'Heater',
      Length: 0.83,
      Width: 1.2,
      Depth: 0.53,
      Diameter: 1.35,
    }
  ];

  return (
    <div className="App">
      <header className="App-header">
        <Button id="test-button" onClick={() => setData(json)}>Read Data</Button>
        <Container id="test-container">
          <DBItemContainer properties={data} />
        </Container>
      </header>
    </div>
  );
}

export default App;
