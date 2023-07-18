import React, {useState} from 'react'
import {Box} from "grommet";
import {Button, Divider, Modal, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {AccountInfo} from "../../components/Account";
import {observer} from "mobx-react";
import {useStores} from "../../stores/useStores";

const { Text } = Typography

export const UserAccount = observer(() => {
  const navigate = useNavigate()
  const { authStore } = useStores()

  const [isModalOpen, setModalOpen] = useState(false)

  if(!authStore?.userAccount) {
    return null
  }

  // const onDeleteClicked = async () => {
  //   storage.deleteAccount()
  //   navigate(`/create-wallet`)
  // }

  const onSendClicked = () => {
    navigate('/send')
  }

  return <Box>
    <AccountInfo />
    <Box>
      <Divider />
      <Box gap={'16px'}>
        <Button type={'primary'} onClick={onSendClicked}>Send ONE</Button>
        <Button onClick={() => setModalOpen(true)}>Export private key</Button>
        {/*<Button danger onClick={onDeleteClicked}>Delete account</Button>*/}
        <Box>
          <Modal title="Private key" open={isModalOpen} onOk={() => setModalOpen(false)} onCancel={() => setModalOpen(false)}>
            <Text copyable={true}>
              {authStore.userAccount.privateKey}
            </Text>
          </Modal>
        </Box>
      </Box>
    </Box>
  </Box>
})
