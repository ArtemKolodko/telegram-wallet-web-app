import React, {useEffect, useState} from 'react'
import {Box} from "grommet";
import {Button, Typography, Image, Checkbox} from "antd";
import { toDataURL } from 'qrcode'
import Web3 from 'web3'
import {useNavigate} from "react-router-dom";
import {saveEncryptedAccount, saveTotpToken} from "../../utils/storage";
import {generateTOTP, getAccountPassword} from "../../utils/account";
import * as storage from "../../utils/storage";
import {authStore} from "../../stores/auth";

const { Text } = Typography;

const web3 = new Web3()

export const CreateWallet = () => {
  const navigate = useNavigate()
  const { secret, userId } = storage.getAccountSession()

  const [qrCode, setQrCode] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [account] = useState(web3.eth.accounts.create())

  useEffect(() => {
    const generateToken = async () => {
      const totp = generateTOTP(secret, userId)
      const uri = totp.toString();
      const qr = await toDataURL(uri)
      const token = totp.generate();
      saveTotpToken(token)
      setQrCode(qr)
    }
    generateToken()
  }, [secret, userId])

  const saveUserAccount = async () => {
    const password = getAccountPassword(secret, userId)
    const encrypted = await web3.eth.accounts.encrypt(account.privateKey, password)
    saveEncryptedAccount(JSON.stringify(encrypted))
    authStore.setLoggedIn(true)

    navigate(`/?updateAccount=true`)
  }

  return <Box pad={'8px'}>
    <Box align={'center'} margin={{ top: 'medium' }}>
      <Text>Scan QR code with Authenticator app</Text>
      <Box align={'center'}>
        <Image width={'200px'} height={'200px'} src={qrCode} preview={false} />
      </Box>
      <Text style={{ fontSize: 'x-small' }}>Or enter key manually:</Text>
      <Box align={'center'}>
        <Text style={{ fontSize: 'x-small' }} copyable={true}>{secret}</Text>
      </Box>
    </Box>
    <Box margin={{ top: 'large' }}>
      <Box align={'center'}>
        <Text style={{ fontSize: 'x-small' }}>Address: {account.address}</Text>
      </Box>
    </Box>
    {(secret && userId) &&
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
    }
    {(!secret || !userId) &&
        <Box>
            <Text style={{ fontWeight: 'bold'}}>
                Cannot complete registration: no secret or telegram userId provided. Try to open web app again.
            </Text>
        </Box>
    }
  </Box>
}
