import React, {useEffect, useState} from 'react'
import {Box} from "grommet";
import {Button, Typography} from "antd";
import useAccount from "../../hooks/useAccount";
import Web3 from "web3";
import config from "../../config";
import {deleteAccount} from "../../utils/storage";
import {useNavigate} from "react-router-dom";
import {deleteWallet, getWallets} from "../../api/payments";

const { Text } = Typography

export const UserAccount = () => {
  const [account] = useAccount()
  const navigate = useNavigate()

  const urlParams = new URLSearchParams(window.location.search);
  const secret = urlParams.get('secret') || ''
  const userId = urlParams.get('userId') || ''

  const [userBalance, setUserBalance] = useState('0')

  useEffect(() => {
    const getUserData = async () => {
      try {
        if(account) {
          const web3 = new Web3(config.rpcUrl)
          const data = await web3.eth.getBalance(account?.address)
          setUserBalance(Web3.utils.fromWei(data, 'ether'))
        }
      } catch(e) {
        console.log('Cannot get user balance', e)
      }
    }
    getUserData()
  }, [account])

  if(!account) {
    return null
  }

  const onDeleteClicked = async () => {
    deleteAccount()

    try {
      const wallets = await getWallets(userId, account.address)
      if(wallets.items.length > 0) {
        const wallet = wallets.items[0]
        await deleteWallet(wallet.id)
      }
    } catch (e) {
      console.log('Cannot delete wallet', e)
    }
    navigate(`/create-wallet?secret=${secret}&userId=${userId}`)
  }

  return <Box pad={'16px'}>
    <Box gap={'16px'}>
      <Box direction={'row'}>
        <Text>User address:</Text>
        <Text copyable={true}>{account.address}</Text>
      </Box>
      <Text>Balance: {userBalance} ONE</Text>
    </Box>
    <Box margin={{ top: '32px' }}>
      <Box gap={'16px'}>
        <Button type={'primary'}>Send ONE</Button>
        <Button danger onClick={onDeleteClicked}>Delete account</Button>
      </Box>
    </Box>
  </Box>
}
