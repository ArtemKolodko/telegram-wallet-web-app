import React, {useEffect, useState} from 'react'
import {Box} from "grommet";
import moment from 'moment'
import {Button, Badge, Card, Typography, Spin, Modal, Input} from 'antd'
import {EditOutlined} from '@ant-design/icons';
import {useStores} from "../../stores/useStores";
import {DcDomainInfo} from "../../types";
import {createDomain, genNFT, relayerCheckDomain, relayerRegister, renewMetadata} from "../../api/1country";
import * as utils from "./utils";
import {saveLastDomainName} from "./utils";

const getRandomInRange = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const lastUsedDomainName = utils.getLastDomainName()
const defaultDomainName = lastUsedDomainName || 'mydomain' + getRandomInRange(1, 100)
const secret = Math.random().toString(26).slice(2)

export const OneCountry = () => {
  const { authStore } = useStores()

  const urlParams = new URLSearchParams(window.location.search);

  const [domainName, setDomainName] = useState(
    (urlParams.get('domainName') || defaultDomainName).toLowerCase()
  )
  const [tempDomainName, setTempDomainName] = useState((urlParams.get('domainName') || defaultDomainName).toLowerCase())
  const [progressStatus, setProgressStatus] = useState('')
  const [domainInfo, setDomainInfo] = useState<DcDomainInfo>()
  const [price, setPrice] = useState('')
  const [txError, setTxError] = useState('')
  const [txHash, setTxHash] = useState('')
  const [isEditingOpen, setEditingOpen] = useState(false)
  const [isAvailable, setAvailable] = useState<boolean | undefined>()
  const [inProgress, setInProgress] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if(domainName !== lastUsedDomainName) {
      saveLastDomainName(domainName)
    }
  }, [domainName]);

  const loadDomainInfo = async () => {
    setTxError('')
    setIsLoading(true)
    try {
      console.log('loadDomainInfo', domainName)
      const priceData = await authStore.dcGetPrice(domainName)
      let available = await authStore.dcIsAvailable(domainName)
      const info = await authStore.dcDomainInfo(domainName)
      console.log('dc info', info, 'available', available)
      if(available) {
        const relayedData = await relayerCheckDomain(domainName)
        console.log('relayedData', relayedData)
        available = relayedData.isAvailable
      }
      setAvailable(available)
      setPrice(priceData)
      setDomainInfo(info)
    } catch (e) {
      console.error('Cannot load domain data', e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDomainInfo()
  }, [authStore, domainName]);

  const renewDomain = async () => {
    setProgressStatus('Renewing domain...')
    const renewTx = await authStore.dcRenew(domainName, price)
    console.log('renewTx', renewTx)
    setTxHash(renewTx.transactionHash)

    setProgressStatus('Waiting for confirmation')
    await new Promise(resolve => setTimeout(resolve, 4000))

    setProgressStatus('Updating NFT metadata...')
    const nftResult = await renewMetadata(domainName)
    console.log('NFT result:', nftResult)
    await loadDomainInfo()
    setProgressStatus('')
  }

  const rentDomain = async () => {
    setProgressStatus('Registering domain...')
    const commitTx = await authStore.dcCommit(domainName, authStore.userAccount.address, secret)
    console.log('commitTx', commitTx)
    await new Promise(resolve => setTimeout(resolve, 5000))
    const registerTx = await authStore.dcRegister(
      domainName,
      authStore.userAccount.address,
      secret,
      price
    )
    console.log('registerTx', registerTx)
    setTxHash(registerTx.transactionHash)
    const { transactionHash } = registerTx
    setProgressStatus('Domain registered, generating NFT...')
    await createDomain(domainName, transactionHash)
    await relayerRegister(domainName, transactionHash, authStore.userAccount.address)
    const nftRes = await genNFT(domainName)
    console.log('nft result:', nftRes)
    await loadDomainInfo()
    setProgressStatus('')
  }

  const onSendClicked = async (opType: 'rent' | 'renew') => {
    setInProgress(true)
    setTxError('')
    setProgressStatus('')
    try {
      if(opType === 'rent') {
        await rentDomain()
      } else if(opType === 'renew') {
        await renewDomain()
      }
    } catch (e) {
      console.error('Cannot send tx', e)
      setTxError((e as Error).message)
    } finally {
      setInProgress(false)
      setProgressStatus('')
    }
  }

  let badgeColor = 'grey'
  let badgeStatusText = 'Verifying...'
  const isOwner = domainInfo && domainInfo.owner === authStore.userAccount.address
  if(typeof isAvailable !== 'undefined') {
    if(isAvailable || isOwner) {
      badgeColor = '#03C988'
    } else {
      badgeColor = 'red'
    }
    badgeStatusText = isAvailable ? 'Available' : 'Unavailable';
    if(domainInfo) {
      if(domainInfo.owner === authStore.userAccount.address) {
        badgeStatusText = 'You are the owner'
      }
    }
  }

  if(typeof isAvailable === 'undefined') {
    return <Box margin={{ top: 'large' }}>
      <Spin size={'large'} />
    </Box>
  }

  const CardTitle =  <Box gap={'8px'} align={'center'} direction={'row'}>
    <Typography.Link href={`https://${domainName}.country`} target="_blank">
      {domainName}.country
    </Typography.Link>
    <EditOutlined onClick={() => setEditingOpen(true)} />
  </Box>

  return <Box>
    <Box margin={{ top: 'large' }}>
      <Badge.Ribbon text={badgeStatusText} color={badgeColor}>
        <Card title={CardTitle} size="default">
          {(isOwner && domainInfo) &&
              <Box margin={{ bottom: '16px' }} style={{ opacity: isLoading ? 0.4 : 'unset' }}>
                  <Typography.Text type={'secondary'} style={{ fontSize: '18px', fontWeight: 400 }}>
                      Rented until
                  </Typography.Text>
                  <Typography.Text style={{ fontSize: '22px' }}>
                    {moment(domainInfo.expirationTime * 1000).format('MMMM Do YYYY')}
                  </Typography.Text>
              </Box>
          }
          <Box style={{ opacity: isLoading ? 0.4 : 'unset' }}>
            <Typography.Text type={'secondary'} style={{ fontSize: '18px', fontWeight: 400 }}>
              {isOwner ? 'Renew' : 'Rent'} price
            </Typography.Text>
            <Box direction={'row'} gap={'8px'}>
              <Typography.Text style={{ fontSize: '22px' }}>
                {authStore.web3.utils.fromWei(price)} ONE
              </Typography.Text>
              <Typography.Text type={'secondary'} style={{ fontSize: '22px' }}>
                for 30 days
              </Typography.Text>
            </Box>
          </Box>
        </Card>
      </Badge.Ribbon>
    </Box>
    <Box margin={{ top: 'large' }}>
      {!isOwner &&
          <Button
              type={'primary'}
              loading={inProgress}
              disabled={!isAvailable || isLoading}
              onClick={() => onSendClicked('rent')}
          >
            {progressStatus || 'Rent'}
          </Button>
      }
      {isOwner &&
          <Button
              type={'primary'}
              loading={inProgress}
              disabled={isLoading || !isOwner}
              onClick={() => onSendClicked('renew')}

          >
            {progressStatus || 'Renew'}
          </Button>
      }
      {txError &&
          <Box margin={{ top: 'small' }}>
              <Typography.Text type={'danger'}>Error: {txError}</Typography.Text>
          </Box>
      }
      {(txHash && isOwner) &&
          <Box margin={{ top: 'large' }}>
              <Typography.Text type={'secondary'}>Transaction hash:</Typography.Text>
              <Typography.Link href={`https://explorer.harmony.one/tx/${txHash}`} target="_blank">
                {txHash}
              </Typography.Link>
          </Box>
      }
    </Box>
    <Modal
      title="Domain name"
      open={isEditingOpen}
      onOk={() => {
        if(tempDomainName !== domainName) {
          setDomainName(tempDomainName.toLowerCase())
        }
        setEditingOpen(false)
      }}
      onCancel={() => setEditingOpen(false)}
    >
      <Input
        value={tempDomainName}
        allowClear
        onChange={(e) => setTempDomainName(e.target.value || '')}
      />
    </Modal>
  </Box>
}
