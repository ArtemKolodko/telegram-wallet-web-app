import React from 'react'
import {Box} from "grommet";
import {Button, Divider} from "antd";
import * as storage from "../../utils/storage";
import {useNavigate} from "react-router-dom";
import {AccountInfo} from "../../components/Account";
import {observer} from "mobx-react";
import {AuthStore} from "../../stores/auth";

export const UserAccount = observer((props: { authStore?: AuthStore }) => {
  const { authStore } = props
  const navigate = useNavigate()

  if(!authStore?.userAccount) {
    return null
  }

  const onDeleteClicked = async () => {
    storage.deleteAccount()
    navigate(`/create-wallet`)
  }

  const onSendClicked = () => {
    navigate('/send')
  }

  return <Box pad={'16px'}>
    <AccountInfo />
    <Box>
      <Divider />
      <Box gap={'16px'}>
        <Button type={'primary'} onClick={onSendClicked}>Send ONE</Button>
        <Button danger onClick={onDeleteClicked}>Delete account</Button>
      </Box>
    </Box>
  </Box>
})
