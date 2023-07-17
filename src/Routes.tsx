import React from 'react'
import {Outlet, Route, Routes} from "react-router-dom";
import {UserAccount} from "./pages/account/Account";
import {CreateWallet} from "./pages/create-wallet/CreateWallet";
import SendOne from "./pages/send";
import {Box} from "grommet";
import {AppMenu} from "./components/Menu";

const AppLayout = () => {
  return <Box pad={'16px'}>
    <AppMenu />
    <Box margin={{ top: '16px' }}>
      <Outlet />
    </Box>
  </Box>
}

export const AppRoutes = () => {
  return <Box>
    <Routes>
      <Route element={<AppLayout />}>
        <Route index path={'/'} element={<UserAccount />}/>
        <Route path={'create-wallet'} element={<CreateWallet />} />
        <Route path={'send'} element={<SendOne />} />
      </Route>
    </Routes>
  </Box>
}
