import React, {useEffect} from 'react'
import {Route, Routes, useNavigate} from "react-router-dom";
import {UserAccount} from "./pages/account/Account";
import {CreateWallet} from "./pages/create-wallet/CreateWallet";
import useAccount from "./hooks/useAccount";

export const AppRoutes = () => {
  const navigate = useNavigate()
  const urlParams = new URLSearchParams(window.location.search);
  const secret = urlParams.get('secret') || ''
  const username = urlParams.get('username') || ''
  const [account, isAccountLoaded] = useAccount()

  useEffect(() => {
    const initialRedirects = () => {
      if(isAccountLoaded && !account) {
        navigate(`/create-wallet?secret=${secret}&username=${username}`)
      }
    }
    initialRedirects()
  }, [isAccountLoaded, account, navigate, secret, username])

  return <Routes>
    <Route
      index
      path={'/'}
      element={<UserAccount />}
    />
    <Route path={'create-wallet'} element={<CreateWallet />} />
  </Routes>
}
