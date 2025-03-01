import { test, expect } from '@playwright/test';
import { createUser, validateJsonSchema } from '../../helper/api-helper';
import { setup } from '../../helper/setup';

const header = {
  'Authorization': `Bearer ${setup.apiToken}`
}

const invalidHeader = {
  'Authorization': 'Bearer invalid'
}

test.describe('Success to PATCH existing users', async() => {
  test('TAPI0011-Success to update existing users with valid data and using PATCH method', async ({ request }) => {
    const body = await createUser('valid');
    
    const response = await request.post(`/public/v2/users`, { headers: header, data: body })  
    const responseJson = await response.json()
    expect(response.status()).toBe(201)
    expect(await validateJsonSchema('user', responseJson))
    const userId = responseJson['id']

    const updatedBody = {
      ...body,
      status: 'inactive'
    }

    const updateUser = await request.patch(`/public/v2/users/${userId}`, { headers: header, data: updatedBody })  
    const updatedUserJson = await updateUser.json()
    expect(updateUser.status()).toBe(200)
    expect(updatedUserJson['status']).toEqual("inactive")
    expect(await validateJsonSchema('user', updatedUserJson))
  });
})

test.describe('Failed to PATCH existing users', async() => {
  test('TAPI0012-Failed to update existing users without Authorization and using PATCH method', async ({ request }) => {
    const body = await createUser('valid');
    
    const response = await request.post(`/public/v2/users`, { headers: header, data: body })  
    const responseJson = await response.json()
    expect(response.status()).toBe(201)
    expect(await validateJsonSchema('user', responseJson))
    const userId = responseJson['id']

    const updatedBody = {
      ...body,
      status: 'inactive'
    }

    const updateUser = await request.patch(`/public/v2/users/${userId}`, { data: updatedBody })  
    const updatedUserJson = await updateUser.json()
    expect(updateUser.status()).toBe(401)
    expect(updatedUserJson['message']).toEqual("Authentication failed")
  });

  test('TAPI0013-Failed to update existing users with invalid data and using PATCH method', async ({ request }) => {
    const body = await createUser('valid');
    
    const response = await request.post(`/public/v2/users`, { headers: header, data: body })  
    const responseJson = await response.json()
    expect(response.status()).toBe(201)
    expect(await validateJsonSchema('user', responseJson))
    const userId = responseJson['id']

    const updatedBody = {
      ...body,
      status: 'pending'
    }

    const updateUser = await request.patch(`/public/v2/users/${userId}`, { headers: header, data: updatedBody })  
    const updatedUserJson = await updateUser.json()
    expect(updateUser.status()).toBe(422)
    expect(updatedUserJson[0]['field']).toEqual("status")
    expect(updatedUserJson[0]['message']).toEqual("can't be blank")
  });

  test('TAPI0014-Failed to update existing users with invalid Authorization and using PATCH method', async ({ request }) => {
    const body = await createUser('valid');
    
    const response = await request.post(`/public/v2/users`, { headers: header, data: body })  
    const responseJson = await response.json()
    expect(response.status()).toBe(201)
    expect(await validateJsonSchema('user', responseJson))
    const userId = responseJson['id']

    const updatedBody = {
      ...body,
      status: 'inactive'
    }

    const updateUser = await request.patch(`/public/v2/users/${userId}`, { headers: invalidHeader, data: updatedBody })  
    const updatedUserJson = await updateUser.json()
    expect(updateUser.status()).toBe(401)
    expect(updatedUserJson['message']).toEqual("Invalid token")
  });

  test('TAPI0015-Failed to update non-exist users with Authorization and using PATCH method', async ({ request }) => {
    const userId = 10000000

    const updatedBody = {
      status: 'inactive'
    }

    const updateUser = await request.patch(`/public/v2/users/${userId}`, { headers: header, data: updatedBody })  
    const updatedUserJson = await updateUser.json()
    expect(updateUser.status()).toBe(404)
    expect(updatedUserJson['message']).toEqual("Resource not found")
  });
})