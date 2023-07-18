import React, {useState} from 'react'
import {Box} from "grommet";
import {Button, Divider, Modal, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {AccountInfo} from "../../components/Account";
import {observer} from "mobx-react";
import { Account } from "web3-core";
import {useStores} from "../../stores/useStores";
import {ImportAccount} from "./ImportAccount";

const { Text } = Typography

export const UserAccount = observer(() => {
  const navigate = useNavigate()
  const { authStore } = useStores()

  const [isPrivateKeyModalOpened, setPrivateKeyModalOpened] = useState(false)
  const [isImportModalOpened, setImportModalOpened] = useState(false)
  const [importedAccount, setImportedAccount] = useState<Account|null>(null)

  if(!authStore?.userAccount) {
    return null
  }

  const onSendClicked = () => {
    navigate('/send')
  }

  const onImportClicked = () => {
    if(importedAccount) {
      authStore.saveUserAccount(importedAccount)
      setImportModalOpened(false)
    }
  }

  return <Box>
    <AccountInfo />
    <Box>
      <Divider />
      <Box gap={'16px'}>
        <Button type={'primary'} onClick={onSendClicked}>Send ONE</Button>
        <Button onClick={() => setPrivateKeyModalOpened(true)}>Export private key</Button>
        <Button onClick={() => setImportModalOpened(true)}>Import account</Button>
        <Box>
          <Modal title="Private key" open={isPrivateKeyModalOpened} onOk={() => setPrivateKeyModalOpened(false)} onCancel={() => setPrivateKeyModalOpened(false)}>
            <Text copyable={true}>
              {authStore.userAccount.privateKey}
            </Text>
          </Modal>
          <Modal
            title="Import account"
            open={isImportModalOpened}
            okText={'Import'}
            okButtonProps={{ disabled: !importedAccount, danger: true }}
            onOk={onImportClicked}
            onCancel={() => setImportModalOpened(false)}
          >
            <ImportAccount
              onUpdate={(account) => setImportedAccount(account)}
            />
          </Modal>
        </Box>
      </Box>
    </Box>
  </Box>
})
