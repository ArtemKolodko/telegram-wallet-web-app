import React from 'react'
import {Box} from "grommet";
import {Button, Divider} from "antd";
import {useNavigate} from "react-router-dom";
import {AccountInfo} from "../../components/Account";
import {observer} from "mobx-react";
import {useStores} from "../../stores/useStores";

export const UserAccount = observer(() => {
  const navigate = useNavigate()
  const { authStore } = useStores()

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
    <AccountInfo exportPrivateKey={true} />
    <Box>
      <Divider />
      <Box gap={'16px'}>
        <Button type={'primary'} onClick={onSendClicked}>Send ONE</Button>
        {/*<Button danger onClick={onDeleteClicked}>Delete account</Button>*/}
      </Box>
    </Box>
  </Box>
})
