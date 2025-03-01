import { faker } from "@faker-js/faker";
import { Locator } from "@playwright/test";

export async function waitForElement(element: Locator) {
  await element.waitFor({ state: 'visible', timeout: 10000 })
}

export async function generateRandomTodo(condition: 'with-emoji') {
  let text: string;

  if (condition == 'with-emoji') {
    const emojiList = ['😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲']
    text = `${faker.word.verb()} ${faker.string.symbol(5)} ${faker.string.fromCharacters(emojiList)}`
  }

  return text;
}