import React, {useEffect} from 'react'
import {Route, Routes, useNavigate} from "react-router-dom";
import {UserAccount} from "./pages/account/Account";
import {CreateWallet} from "./pages/create-wallet/CreateWallet";
import useAccount from "./hooks/useAccount";

export const AppRoutes = () => {
  const navigate = useNavigate()
  const urlParams = new URLSearchParams(window.location.search);
  const secret = urlParams.get('secret') || ''
  const userId = urlParams.get('userId') || ''
  const [account, isAccountLoaded] = useAccount()

  useEffect(() => {
    const initialRedirects = () => {
      if(isAccountLoaded && !account) {
        navigate(`/create-wallet?secret=${secret}&userId=${userId}`)
      }
    }
    initialRedirects()
  }, [isAccountLoaded, account, navigate, secret, userId])

  return <Routes>
    <Route
      index
      path={'/'}
      element={<UserAccount />}
    />
    <Route path={'create-wallet'} element={<CreateWallet />} />
  </Routes>
}
