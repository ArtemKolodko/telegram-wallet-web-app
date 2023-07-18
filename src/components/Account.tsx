import React from 'react'
import {Box} from "grommet";
import {Typography} from "antd";
import {observer} from "mobx-react";
import {useStores} from "../stores/useStores";
import {cutAddress} from "../utils";
import Web3 from "web3";
const { Text } = Typography

const UserBalance = (props: { value: string }) => {
  const valueOne = Web3.utils.fromWei(props.value, 'ether')
  const [decimalPart, fractionalPart] = valueOne.split('.')

  return <Box direction={'row'} gap={'8px'}>
    <Box direction={'row'}>
      <Text style={{ fontSize: 'x-large' }}>
        {decimalPart}
      </Text>
      {fractionalPart &&
          <Box direction={'row'} align={'baseline'}>
              <Text style={{ fontSize: 'x-large' }}>.</Text>
              <Text type={'secondary'} style={{ fontSize: 'large' }}>
                {fractionalPart}
              </Text>
          </Box>
      }
    </Box>
    <Text style={{ fontSize: 'x-large' }}>
      ONE
    </Text>
  </Box>
}


export const AccountInfo = observer(() => {
  const { authStore } = useStores()

  const userAddress = authStore.userAccount.address

  return <Box gap={'16px'}>
    <Box>
      <Text type={'secondary'} style={{ fontSize: 'small' }}>Address</Text>
      <Text copyable={{ text: userAddress }} style={{ fontSize: 'x-large' }}>
        {cutAddress(userAddress)}
      </Text>
    </Box>
    <Box>
      <Text type={'secondary'} style={{ fontSize: 'small' }}>Balance</Text>
      <UserBalance value={authStore.userBalance} />
    </Box>
  </Box>
})
