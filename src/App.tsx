import React, {useEffect} from 'react';
import {Grommet} from 'grommet';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {CreateWallet} from "./pages/create-wallet/CreateWallet";
import {UserAccount} from "./pages/account/Account";

function App() {
  return <Grommet full>
    <BrowserRouter>
      <Routes>
        <Route index path={'account'} element={<UserAccount />} />
        <Route path={'create-wallet'} element={<CreateWallet />} />
      </Routes>
    </BrowserRouter>
  </Grommet>
}

export default App;
