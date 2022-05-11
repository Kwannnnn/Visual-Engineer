import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from './components/Button';
import Container from './components/Container';

function App() {
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
        <Button>Hi</Button>
        <Container>
          <p>Yo</p>
          <p>Ey</p>
          <p>Hey</p>
          <p>One very annoyingly long text that is
            super stupid to style and to deal with cause why not
          </p>
          <p>1234</p>
          <p>More stuff</p>
          <p>And even more stuff</p>
          <p>And the rest of the stuff</p>
          <p>English is difficult</p>
        </Container>
      </header>
    </div>
  );
}

export default App;
