import React from 'react'
import {Box} from "grommet";
import {Typography} from "antd";
import {observer} from "mobx-react";
import {useStores} from "../stores/useStores";
import {cutAddress} from "../utils";
import Web3 from "web3";
const { Text } = Typography


export const AccountInfo = observer(() => {
  const { authStore } = useStores()

  const userAddress = authStore.userAccount ? authStore.userAccount.address : ''

  return <Box gap={'16px'}>
    <Box>
      <Text type={'secondary'} style={{ fontSize: 'small' }}>Address</Text>
      <Text copyable={{ text: userAddress }} style={{ fontSize: 'x-large' }}>
        {userAddress &&
          cutAddress(userAddress)
        }
      </Text>
    </Box>
    <Box>
      <Text type={'secondary'} style={{ fontSize: 'small' }}>Balance</Text>
      <Text style={{ fontSize: 'x-large' }}>
        {Web3.utils.fromWei(authStore?.userBalance, 'ether')} ONE
      </Text>
    </Box>
  </Box>
})
