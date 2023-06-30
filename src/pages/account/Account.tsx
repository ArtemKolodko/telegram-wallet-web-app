import React from 'react'
import {Box} from "grommet";
import {Button} from "antd";
import useAccount from "../../hooks/useAccount";
import * as storage from "../../utils/storage";
import {useNavigate} from "react-router-dom";
import {deleteWallet, getWallets} from "../../api/payments";
import {AccountInfo} from "../../components/Account";

export const UserAccount = () => {
  const { account } = useAccount()
  const navigate = useNavigate()

  const { userId } = storage.getAccountSession()

  if(!account) {
    return null
  }

  const onDeleteClicked = async () => {
    storage.deleteAccount()

    // try {
    //   const wallets = await getWallets(userId, account.address)
    //   if(wallets.items.length > 0) {
    //     const wallet = wallets.items[0]
    //     await deleteWallet(wallet.id)
    //   }
    // } catch (e) {
    //   console.log('Cannot delete wallet', e)
    // }
    navigate(`/create-wallet`)
  }

  const onSendClicked = () => {
    navigate('/send')
  }

  return <Box pad={'16px'}>
    <AccountInfo />
    <Box margin={{ top: '32px' }}>
      <Box gap={'16px'}>
        <Button type={'primary'} onClick={onSendClicked}>Send ONE</Button>
        <Button danger onClick={onDeleteClicked}>Delete account</Button>
      </Box>
    </Box>
  </Box>
}
