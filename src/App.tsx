import React from 'react';
import {Grommet} from 'grommet';
import {BrowserRouter} from "react-router-dom";
import { Provider } from "mobx-react";
import {AppRoutes} from "./Routes";
import {authStore} from "./stores/auth";

function App() {
  return <Grommet full>
    <BrowserRouter>
      <Provider authStore={authStore}>
        <AppRoutes />
      </Provider>
    </BrowserRouter>
  </Grommet>
}

export default App;
