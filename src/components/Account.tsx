import React, {useState} from 'react'
import {Box} from "grommet";
import {Button, Modal, Typography} from "antd";
import {observer} from "mobx-react";
import {useStores} from "../stores/useStores";
import {cutAddress} from "../utils";
const { Text } = Typography


export const AccountInfo = observer((props: { exportPrivateKey?: boolean }) => {
  const { authStore } = useStores()
  const [isModalOpen, setModalOpen] = useState(false)

  const userAddress = authStore.userAccount ? authStore.userAccount.address : ''

  return <Box gap={'16px'}>
    <Box>
      <Text type={'secondary'} style={{ fontSize: 'small' }}>Address</Text>
      <Text copyable={{ text: userAddress }} style={{ fontSize: 'x-large' }}>
        {userAddress &&
          cutAddress(userAddress)
        }
      </Text>
      {props.exportPrivateKey && authStore.userAccount &&
          <Box direction={'row'} margin={{ top: '16px' }}>
              <Button onClick={() => setModalOpen(true)}>Export private key</Button>
              <Modal title="Private key" open={isModalOpen} onOk={() => setModalOpen(false)} onCancel={() => setModalOpen(false)}>
                  <Text copyable={true}>
                    {authStore.userAccount.privateKey}
                  </Text>
              </Modal>
          </Box>
      }
    </Box>
    <Box>
      <Text type={'secondary'} style={{ fontSize: 'small' }}>Balance</Text>
      <Text style={{ fontSize: 'x-large' }}>
        {authStore?.userBalance} ONE
      </Text>
    </Box>
  </Box>
})
