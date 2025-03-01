import { test, expect } from '@playwright/test';
import { createUser, validateJsonSchema } from '../../helper/api-helper';
import { setup } from '../../helper/setup';

const header = {
  'Authorization': `Bearer ${setup.apiToken}`
}

const invalidHeader = {
  'Authorization': 'Bearer invalid'
}

test.describe('POST new users', async() => {
  test('TAPI0006,TAPI0007-Success to create new users with valid data and Authorization header', async ({ request }) => {
    const body = await createUser('valid');
    
    const response = await request.post(`/public/v2/users`, { headers: header, data: body })  
    const responseJson = await response.json()
    expect(response.status()).toBe(201)
    expect(responseJson['name']).toEqual(body['name'])
    expect(responseJson['email']).toEqual(body['email'])
    expect(responseJson['gender']).toEqual(body['gender'])
    expect(responseJson['status']).toEqual(body['status'])
    expect(await validateJsonSchema('user', responseJson))
  });

  test('TAPI0008-Failed to create new users without Authorization header', async ({ request }) => {
    const body = await createUser('valid');
    
    const response = await request.post(`/public/v2/users`, { data: body })  
    const responseJson = await response.json()
    expect(response.status()).toBe(401)
    expect(responseJson['message']).toEqual("Authentication failed")
  });

  test('TAPI0009-Failed to create new users with invalid Authorization header', async ({ request }) => {
    const body = await createUser('valid');
    
    const response = await request.post(`/public/v2/users`, { headers: invalidHeader, data: body })  
    const responseJson = await response.json()
    expect(response.status()).toBe(401)
    expect(responseJson['message']).toEqual("Invalid token")
  });

  test('TAPI0010-Verify new users with exactly same data as existing is failed to be created', async ({ request }) => {
    const body = await createUser('valid');
    
    const response = await request.post(`/public/v2/users`, { headers: header, data: body })  
    const responseJson = await response.json()
    expect(response.status()).toBe(201)
    expect(await validateJsonSchema('user', responseJson))

    const newUser = await request.post(`/public/v2/users`, { headers: header, data: body })  
    const newExistingUserJson = await newUser.json()
    expect(newUser.status()).toBe(422)
    expect(newExistingUserJson[0]['field']).toEqual("email")
    expect(newExistingUserJson[0]['message']).toEqual("has already been taken")
  });
})