import React from 'react';
import {Grommet} from 'grommet';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {CreateWallet} from "./pages/create-wallet/CreateWallet";

function App() {
  return <Grommet full>
    <BrowserRouter>
      <Routes>
        <Route index element={<CreateWallet />} />
      </Routes>
    </BrowserRouter>
  </Grommet>
}

export default App;
