import React, {useState} from 'react'
import {Box} from "grommet";
import {Button, Typography, Checkbox} from "antd";
import {useNavigate} from "react-router-dom";
import {useStores} from "../../stores/useStores";

const { Text } = Typography;

export const CreateWallet = () => {
  const navigate = useNavigate()
  const { authStore } = useStores()

  const [isChecked, setIsChecked] = useState(false)
  const [account] = useState(authStore.createUserAccount())

  const saveUserAccount = async () => {
    await authStore.saveUserAccount(account)
    navigate(`/`)
  }

  return <Box pad={'8px'}>
    <Box margin={{ top: 'large' }}>
      <Box align={'center'}>
        <Text style={{ fontSize: 'x-small' }}>Address: {account.address}</Text>
      </Box>
    </Box>
    <Box align={'center'} margin={{ top: 'medium' }}>
      <Box width={'420px'}>
        <Checkbox onChange={(e) => setIsChecked(e.target.checked)}>
          <Text style={{ fontWeight: 'bold' }}>I understand that account is stored only on this device. In the case of loss private key cannot be restored.</Text>
        </Checkbox>
      </Box>
      <Box width={'220px'} margin={{ top: 'medium' }}>
        <Button
          type={'primary'}
          disabled={!isChecked}
          onClick={saveUserAccount}
        >
          Create account
        </Button>
      </Box>
    </Box>
  </Box>
}
