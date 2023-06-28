import React, {useEffect, useState} from 'react'
import {Box} from "grommet";
import {Button, Typography, Image, Checkbox} from "antd";
import * as OTPAuth from "otpauth";
import { toDataURL } from 'qrcode'
import Web3 from 'web3'
import {useNavigate, useSearchParams} from "react-router-dom";
import {saveEncryptedAccount} from "../../utils/storage";
import {getAccountPassword} from "../../utils/account";

const { Text } = Typography;

const web3 = new Web3()

export const CreateWallet = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const secret = searchParams.get('secret') || ''
  const username = searchParams.get('username') || ''

  const [qrCode, setQrCode] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [isPKVisible, setPKVisible] = useState(false)
  const [account, setAccount] = useState(web3.eth.accounts.create())

  useEffect(() => {
    const generateToken = async () => {
      let totp = new OTPAuth.TOTP({
        issuer: "Harmony One Wallet",
        label: username,
        algorithm: "SHA1",
        digits: 6,
        period: 60,
        secret,
      });

      let token = totp.generate();
      console.log('token', token)
      let uri = totp.toString();
      const qr = await toDataURL(uri)
      setQrCode(qr)
    }
    generateToken()
  }, [secret, username])

  const saveUserAccount = async () => {
    const password = getAccountPassword(secret, username)
    const encrypted = await web3.eth.accounts.encrypt(account.privateKey, password)
    // const decrypted = await web3.eth.accounts.decrypt(JSON.stringify(encrypted), secret)
    saveEncryptedAccount(JSON.stringify(encrypted))
    navigate(`/account?secret=${secret}&username=${username}`)
  }

  return <Box pad={'8px'}>
    <Box align={'center'}  margin={{ top: 'medium' }}>
      <Text>Scan QR code with Authenticator app</Text>
    </Box>
    <Box>
      <Box align={'center'}>
        <Image width={'200px'} height={'200px'} src={qrCode} />
      </Box>
      <Box>
        <Text style={{ fontSize: 'x-small' }}>Address: {account.address}</Text>
        <Box direction={'row'}>
          <Box>
            <Text style={{ fontSize: 'x-small' }} underline={true} onClick={() => setPKVisible(!isPKVisible)}>
              {isPKVisible ? 'Hide' : 'Show'} private key
            </Text>
            {isPKVisible &&
              <Text style={{ fontSize: 'x-small' }}>{account.privateKey}</Text>
            }
          </Box>
        </Box>
      </Box>
    </Box>
    {(secret && username) &&
        <Box align={'center'} margin={{ top: 'medium' }}>
            <Box width={'420px'}>
                <Checkbox onChange={(e) => setIsChecked(e.target.checked)}>
                    <Text style={{ fontWeight: 'bold' }}>I understand that account is stored only on this device. In the case of loss private key will not be available.</Text>
                </Checkbox>
            </Box>
            <Box width={'220px'} margin={{ top: 'medium' }}>
                <Button
                    type={'primary'}
                    disabled={!isChecked}
                    onClick={saveUserAccount}
                >
                    Complete registration
                </Button>
            </Box>
        </Box>
    }
    {(!secret || !username) &&
        <Box>
            <Text style={{ fontWeight: 'bold'}}>
                Cannot complete registration: no secret or telegram username provided. Try to open web app again.
            </Text>
        </Box>
    }
  </Box>
}
