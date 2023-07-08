import React, {useEffect} from 'react'
import {Route, Routes, useNavigate} from "react-router-dom";
import {UserAccount} from "./pages/account/Account";
import {CreateWallet} from "./pages/create-wallet/CreateWallet";
import {TOTP} from "./pages/totp/totp";
import SendOne from "./pages/send";
import {observer} from "mobx-react-lite";
import {AuthStore} from "./stores/auth";

export const AppRoutes = observer((props: { authStore: AuthStore }) => {
  const { userAccount, isLoggedIn, isAccountLoaded, isAccountCreated } = props.authStore
  const navigate = useNavigate()

  useEffect(() => {
    const initialRedirects = () => {
      if(!isAccountCreated) {
        navigate(`/create-wallet`)
      } else if(userAccount && !isLoggedIn) {
        navigate(`/totp`)
      }
    }
    if(isAccountLoaded) {
      initialRedirects()
    }
  }, [isAccountLoaded, userAccount, navigate, isAccountCreated, isLoggedIn])

  return <Routes>
    <Route
      index
      path={'/'}
      element={<UserAccount />}
    />
    <Route path={'create-wallet'} element={<CreateWallet />} />
    <Route path={'send'} element={<SendOne />} />
    <Route path={'totp'} element={<TOTP authStore={props.authStore} />} />
  </Routes>
})
