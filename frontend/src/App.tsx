import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from './components/Button';
import Container from './components/Container';
import DBItemContainer from './components/DBItemContainer';

function App() {
  const json = [
    {
      id: 'a',
      name: 'bob',
      age: 22,
      student: true,
    },
    {
      id: 'b',
      name: 'jack',
      age: 19,
      student: false,
    }
  ];
  interface DBData {
    id: string,
    name: string,
    age:number,
    student: boolean,
  }
  const [data, setData] = useState<DBData[]>([]);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="text-red-600">
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Button onClick={() => { setData(json); }}>TEST</Button>
        <Container>
          <DBItemContainer properties={data} />
        </Container>
      </header>
    </div>
  );
}

export default App;
