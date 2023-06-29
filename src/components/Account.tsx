import React, {useEffect, useState} from 'react'
import {Box} from "grommet";
import {Typography} from "antd";
import useAccount from "../hooks/useAccount";
import Web3 from "web3";
import config from "../config";
const { Text } = Typography


export const AccountInfo = () => {
  const { account } = useAccount()
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

  return <Box gap={'16px'}>
    <Box>
      <Text type={'secondary'}>Address</Text>
      <Text copyable={true}>{account && account.address}</Text>
    </Box>
    <Box>
      <Text type={'secondary'}>Balance</Text>
      <Text>{userBalance} ONE</Text>
    </Box>
  </Box>
}
