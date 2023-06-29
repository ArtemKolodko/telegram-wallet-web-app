import axios from 'axios'

const baseURL = 'https://payments-api.fly.dev'
const paymentsApi = axios.create({ baseURL })

interface PaymentWallet {
  id: number
  userId: string
  userAddress: string
  createdAt: string
  updatedAt: string
}

export interface WalletsResponse {
  items: PaymentWallet[]
  count: number
}

export const getWallets = async (userId: string, userAddress: string) => {
  const { data } = await paymentsApi.get<WalletsResponse>('/wallets', {
    data: {
      userId,
      userAddress
    }
  })
  return data
}

export const createWallet = async (userId: string, userAddress: string) => {
  const { data } = await paymentsApi.post<PaymentWallet>('/wallets/create', {
    userId,
    userAddress
  })
  return data
}

export const deleteWallet = async (id: number) => {
  const { data } = await paymentsApi.delete<number>(`/wallets/${id}`)
  return data
}
