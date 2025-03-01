import { test, expect } from '@playwright/test';
import { validateJsonSchema } from '../../helper/api-helper';
import { setup } from '../../helper/setup';

const header = {
  'Authorization': `Bearer ${setup.apiToken}`
}

test.describe('GET specific users', async() => {
  test('TAPI0004-Verify the response when GET specific of existing users with Authorization header', async ({ request }) => {
    const response = await request.get(`/public/v2/users`)
  
    const responseJson = await response.json()
    const userId = responseJson[0]['id']

    const responseUser = await request.get(`/public/v2/users/${userId}`, { headers: header })
    const responseUserJson = await responseUser.json()
    expect(responseUser.status()).toBe(200)
    expect(await validateJsonSchema('user', responseUserJson))
  });

  test('TAPI0005-Verify the response when GET specific of non-existing users with Authorization header', async ({ request }) => {
    const userId = 10000000

    const responseUser = await request.get(`/public/v2/users/${userId}`, { headers: header })
    const responseUserJson = await responseUser.json()
    expect(responseUser.status()).toBe(404)
    expect(responseUserJson['message']).toBe('Resource not found')
  });
})