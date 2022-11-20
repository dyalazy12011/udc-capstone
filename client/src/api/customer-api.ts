import { apiEndpoint } from '../config'
import { Customer } from '../types/Customer';
import { CreateCustomerRequest } from '../types/CreateCustomerRequest';
import Axios from 'axios'
import { UpdateCustomerRequest } from '../types/UpdateCustomerRequest';

export async function getCustomers(idToken: string): Promise<Customer[]> {
  console.log('Fetching customers')

  const response = await Axios.get(`${apiEndpoint}/customers`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
  })
  console.log('customers:', response.data)
  return response.data.items
}

export async function createCustomer(
  idToken: string,
  newCustomer: CreateCustomerRequest
): Promise<Customer> {
  const response = await Axios.post(`${apiEndpoint}/customers`,  JSON.stringify(newCustomer), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    }
  })
  return response.data.item
}

export async function patchCustomer(
  idToken: string,
  customerId: string,
  updatedCustomer: UpdateCustomerRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/customers/${customerId}`, JSON.stringify(updatedCustomer), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    }
  })
}

export async function deleteCustomer(
  idToken: string,
  customerId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/customers/${customerId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  customerId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/customers/${customerId}/logo`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
