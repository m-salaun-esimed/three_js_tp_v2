import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import GravityPuzzleEditor from "./games/gravity-puzzle/GravityPuzzleEditor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
              <Home />
          }
        />
        <Route
          path="/game/:gameId"
          element={
              <GamePage />
          }
        />
        <Route
          path="/editor/gravity-puzzle"
          element={
              <GravityPuzzleEditor />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;