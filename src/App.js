import React from 'react';
import SearchUser from './components/SearchUser';

const App = () => {
  return (
    <div>
    <div style = {{color: 'darkred', margin: '10px'}}> <h1>TeleQuest</h1> </div>
      <SearchUser />
    </div>
  );
};

export default App;
