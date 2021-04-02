import './App.css';
// import AgoraRTCIntegration from './components/agoraRTC/agoraRTC';
import SessionJoin from './components/sessionJoin/sessionJoin';
// import TicTacToe from './components/tictac';
// import DynamicCard from './components/Tryouts/dynamicCard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <TicTacToe /> */}
        {/* <DynamicCard /> */}
        {/* <AgoraRTCIntegration /> */}
        <SessionJoin />
      </header>
    </div>
  );
}

export default App;
