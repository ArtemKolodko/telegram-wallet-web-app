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
  const [isPKVisible, setPKVisible] = useState(false)

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
      } finally {
        setTimeout(getUserData, 1000)
      }
    }
    getUserData()
  }, [account])

  return <Box gap={'16px'}>
    <Box>
      <Text type={'secondary'} style={{ fontSize: 'small' }}>Address</Text>
      <Text copyable={true} style={{ fontSize: 'small' }}>{account && account.address}</Text>
      <Box direction={'row'}>
        <Box>
          <Text underline={true} style={{ fontSize: 'small' }} onClick={() => setPKVisible(!isPKVisible)}>
            {isPKVisible ? 'Hide' : 'Show'} private key
          </Text>
          {isPKVisible &&
              <Text style={{ fontSize: 'small' }}>{account.privateKey}</Text>
          }
        </Box>
      </Box>
    </Box>
    <Box>
      <Text type={'secondary'} style={{ fontSize: 'small' }}>Balance</Text>
      <Text style={{ fontSize: 'small' }}>{userBalance} ONE</Text>
    </Box>
  </Box>
}
