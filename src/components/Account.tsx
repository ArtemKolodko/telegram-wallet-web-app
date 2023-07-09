import React, {useState} from 'react'
import {Box} from "grommet";
import {Typography} from "antd";
import {observer} from "mobx-react";
import {useStores} from "../stores/useStores";
const { Text } = Typography


export const AccountInfo = observer(() => {
  const { authStore } = useStores()
  const [isPKVisible, setPKVisible] = useState(false)

  return <Box gap={'16px'}>
    <Box>
      <Text type={'secondary'} style={{ fontSize: 'small' }}>Address</Text>
      <Text copyable={true} style={{ fontSize: 'small' }}>{authStore && authStore.userAccount && authStore.userAccount.address}</Text>
      {authStore?.userAccount &&
          <Box direction={'row'}>
              <Box>
                  <Text underline={true} style={{ fontSize: 'small' }} onClick={() => setPKVisible(!isPKVisible)}>
                    {isPKVisible ? 'Hide' : 'Show'} private key
                  </Text>
                {(isPKVisible) &&
                    <Text style={{ fontSize: 'small' }}>{authStore.userAccount.privateKey}</Text>
                }
              </Box>
          </Box>
      }
    </Box>
    <Box>
      <Text type={'secondary'} style={{ fontSize: 'small' }}>Balance</Text>
      <Text style={{ fontSize: 'small' }}>{authStore?.userBalance} ONE</Text>
    </Box>
  </Box>
})
