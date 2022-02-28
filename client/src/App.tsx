import { useEffect } from "react";
import "./App.css";
import socketService from "./services/socketService";
import { HomePage } from "./components/HomePage";
import { PlayerPage } from "./components/PlayerPage";
import { HostPage } from "./components/HostPage";
import { useAppSelector } from "./hooks";

const selectPlayer = (state: { player: any }) => state.player;

function App() {

  const username = useAppSelector(selectPlayer);

  const connectSocket = async () => {

    // Grab the host address from the environment
    const host_address = process.env.REACT_APP_PARTYFISH_SERVER as string;

    console.log(host_address);

    socketService.connect(host_address).catch((err) => {
      alert("Could not connect: " + err);
    });
  }
  
  useEffect(() => {
    connectSocket()
  }, []);

  return (
    <div className="app">
      {username === '' ? <HomePage /> : 
      username === "Host" ? <HostPage /> : <PlayerPage />}
    </div>
  );
}

export default App;