import { expect } from "@playwright/test";
import Ajv from "ajv";
import { faker } from '@faker-js/faker'

export async function validateJsonSchema(fileName: string, body: object) {
  const existingSchema = require(`../data/schema/${fileName}`);

  const ajv = new Ajv({ allErrors: false });
  const validate = ajv.compile(existingSchema);
  const validRes = validate(body);

  if (!validRes) {
    console.log("SCHEMA ERRORS:", JSON.stringify(validate.errors), "\nRESPONSE BODY:", JSON.stringify(body));
  }

  expect(validRes).toBe(true);
}

export async function createUser(condition: 'valid' | 'invalid') {
  if (condition == 'valid') {
    return {
      name: faker.person.fullName(),
      gender: faker.person.sex(),
      email: `${faker.person.firstName()}-${faker.number.int()}@yopmail.com`,
      status: 'active'
    }
  }
}