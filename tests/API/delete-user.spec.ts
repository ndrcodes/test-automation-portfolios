import { test, expect } from '@playwright/test';
import { createUser, validateJsonSchema } from '../../helper/api-helper';
import { setup } from '../../helper/setup';

const header = {
  'Authorization': `Bearer ${setup.apiToken}`
}

const invalidHeader = {
  'Authorization': 'Bearer invalid'
}

test.describe('Success to DELETE existing users', async() => {
  test('TAPI0016-Success to DELETE existing user with Authorization', async ({ request }) => {
    const body = await createUser('valid');
    
    const response = await request.post(`/public/v2/users`, { headers: header, data: body })  
    const responseJson = await response.json()
    expect(response.status()).toBe(201)
    expect(await validateJsonSchema('user', responseJson))
    const userId = responseJson['id']

    const deleteUser = await request.delete(`/public/v2/users/${userId}`, { headers: header })  
    expect(deleteUser.status()).toBe(204)

    const getUser = await request.get(`/public/v2/users/${userId}`, { headers: header })  
    expect(getUser.status()).toBe(404)
  });
})

test.describe('Failed to DELETE existing users', async() => {
  test('TAPI0017-Failed to DELETE existing user without Authorization', async ({ request }) => {
    const body = await createUser('valid');
    
    const response = await request.post(`/public/v2/users`, { headers: header, data: body })  
    const responseJson = await response.json()
    expect(response.status()).toBe(201)
    expect(await validateJsonSchema('user', responseJson))
    const userId = responseJson['id']

    const deleteUser = await request.delete(`/public/v2/users/${userId}`)
    expect(deleteUser.status()).toBe(404)
  });

  test('TAPI0018-Failed to DELETE existing user with invalid Authorization', async ({ request }) => {
    const body = await createUser('valid');
    
    const response = await request.post(`/public/v2/users`, { headers: header, data: body })  
    const responseJson = await response.json()
    expect(response.status()).toBe(201)
    expect(await validateJsonSchema('user', responseJson))
    const userId = responseJson['id']

    const deleteUser = await request.delete(`/public/v2/users/${userId}`, { headers: invalidHeader })  
    const deletedUserJson = await deleteUser.json()
    expect(deleteUser.status()).toBe(401)
    expect(deletedUserJson['message']).toEqual("Invalid token")
  });

  test('TAPI0019-Failed to DELETE non-exist user with valid Authorization header', async ({ request }) => {
    const userId = 10000000

    const updateUser = await request.delete(`/public/v2/users/${userId}`, { headers: header })  
    const updatedUserJson = await updateUser.json()
    expect(updateUser.status()).toBe(404)
    expect(updatedUserJson['message']).toEqual("Resource not found")
  });
})