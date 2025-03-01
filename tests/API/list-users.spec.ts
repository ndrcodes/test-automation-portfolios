import { test, expect } from '@playwright/test';
import { validateJsonSchema } from '../../helper/api-helper';
import { setup } from '../../helper/setup';

test.describe('GET list of users', async() => {
  test('TAPI0001-Verify the response when GET list of users without Authorization header', async ({ request }) => {
    const response = await request.get(`/public/v2/users`)
  
    const responseJson = await response.json()
    expect(response.status()).toBe(200)
    expect(await validateJsonSchema('listUser', responseJson))
  });

  test('TAPI0002-Verify the response when GET list of users with Authorization header', async ({ request }) => {
    const header = {
      'Authorization': `Bearer ${setup.apiToken}`
    }
    const response = await request.get(`/public/v2/users`, { headers: header })
  
    const responseJson = await response.json()
    expect(response.status()).toBe(200)
    expect(await validateJsonSchema('listUser', responseJson))
  });

  test('TAPI0003-Verify the response when GET list of users with Authorization header and query parameters status', async ({ request }) => {
    const header = {
      'Authorization': `Bearer ${setup.apiToken}`
    }

    const status = 'active'
    const response = await request.get(`/public/v2/users?status=${status}`, { headers: header })
  
    const responseJson = await response.json()
    const userStatuses = responseJson.map((user: { status: string; }) => user.status);
    expect(response.status()).toBe(200)
    expect(await validateJsonSchema('listUser', responseJson))
    expect(userStatuses).toEqual(expect.arrayContaining([status]));
  });

  test('TAPI0003-Verify the response when GET list of users with Authorization header and query parameters gender', async ({ request }) => {
    const header = {
      'Authorization': `Bearer ${setup.apiToken}`
    }

    const gender = 'male'
    const response = await request.get(`/public/v2/users?gender=${gender}`, { headers: header })
  
    const responseJson = await response.json()
    const userGender = responseJson.map((user: { gender: string; }) => user.gender);
    expect(response.status()).toBe(200)
    expect(await validateJsonSchema('listUser', responseJson))
    expect(userGender).toEqual(expect.arrayContaining([gender]));
  });
})