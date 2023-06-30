import React, {useEffect} from 'react'
import {Route, Routes, useNavigate} from "react-router-dom";
import {UserAccount} from "./pages/account/Account";
import {CreateWallet} from "./pages/create-wallet/CreateWallet";
import useAccount from "./hooks/useAccount";
import * as storage from "./utils/storage";
import {TOTP} from "./pages/totp/totp";
import SendOne from "./pages/send";
import {observer} from "mobx-react-lite";
import {authStore} from "./stores/auth";

export const AppRoutes = observer(() => {
  const navigate = useNavigate()

  const { account, isLoaded: isAccountLoaded } = useAccount()

  useEffect(() => {
    const initialRedirects = () => {
      if(!account) {
        navigate(`/create-wallet`)
      } else if(account && !authStore.isLoggedIn) {
        navigate(`/totp`)
      }
    }
    if(isAccountLoaded) {
      initialRedirects()
    }
  }, [isAccountLoaded, account, navigate, authStore.isLoggedIn])

  return <Routes>
    <Route
      index
      path={'/'}
      element={<UserAccount />}
    />
    <Route path={'create-wallet'} element={<CreateWallet />} />
    <Route path={'send'} element={<SendOne />} />
    <Route path={'totp'} element={<TOTP />} />
  </Routes>
})
