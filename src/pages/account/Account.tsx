import React from 'react'
import {Box} from "grommet";
import {Button} from "antd";
import useAccount from "../../hooks/useAccount";
import * as storage from "../../utils/storage";
import {useNavigate} from "react-router-dom";
import {AccountInfo} from "../../components/Account";

export const UserAccount = () => {
  const { account } = useAccount()
  const navigate = useNavigate()

  if(!account) {
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
    <Box margin={{ top: '32px' }}>
      <Box gap={'16px'}>
        <Button type={'primary'} onClick={onSendClicked}>Send ONE</Button>
        <Button danger onClick={onDeleteClicked}>Delete account</Button>
      </Box>
    </Box>
  </Box>
}
