import type { testCaseT } from '@/utils/schemas'
import axios from 'redaxios'

export async function getContent(filePath: string): Promise<string> {
  return axios.get(`/api/get-content?path=${filePath}`).then(r => r.data.content)
}

export async function getJsonContent(filePath: string): Promise<testCaseT> {
  return axios.get(`/api/get-content?path=${filePath}`).then(r => JSON.parse(r.data.content))
}
