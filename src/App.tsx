import React from 'react';
import {Grommet} from 'grommet';
import {BrowserRouter} from "react-router-dom";
import {AppRoutes} from "./Routes";

function App() {
  return <Grommet full>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </Grommet>
}

export default App;
