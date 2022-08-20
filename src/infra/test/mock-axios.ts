import axios, { AxiosResponse } from 'axios'
import { faker } from '@faker-js/faker'

export const mockHttpResponse = (): Pick<AxiosResponse<any>, 'data' | 'status'> => ({
  data: faker.datatype.uuid(),
  status: faker.datatype.number()
})

export const mockAxios = (): jest.Mocked<typeof axios> => {
  const mockedAxios = axios as jest.Mocked<typeof axios>
  mockedAxios.post.mockResolvedValue(mockHttpResponse())

  return mockedAxios
}
