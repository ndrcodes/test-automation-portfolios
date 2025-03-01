import { test, expect } from '@playwright/test';
import { TodoPage } from '../../pages/todo.pages';
import { generateRandomTodo } from '../../helper/web-helper';

test.describe('Success Add ToDo', async() => {
  test('TWEB0001-Verify success to add new todo when todo value is valid', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.goto();
    const todoTitle = await todoPage.addSingleTodo('random');

    await expect(todoPage.lblCountTodo).toContainText('1 item left');
    expect(await todoPage.lblTodoTitle.count()).toBe(1);
    expect(await todoPage.lblTodoTitle.first().textContent()).toEqual(todoTitle)
  });

  test('TWEB0003-Verify success to add new todo when todo value is exist', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.goto();
    const todoTitles = ['text-random', 'text-random']

    for (const title of todoTitles) {
      await todoPage.addSingleTodo(title);
    }

    await expect(todoPage.lblCountTodo).toContainText('2 items left');
    expect(await todoPage.lblTodoTitle.count()).toBe(2);

    for (const index in todoTitles) {
      expect(await todoPage.lblTodoTitle.nth(parseInt(index)).textContent()).toBe(todoTitles[parseInt(index)])
    }
  });

  test('TWEB0004-Verify success to add new todo when todo value consist of special character and emojis', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.goto();
    const todoTitle = await generateRandomTodo('with-emoji');
    await todoPage.addSingleTodo(todoTitle);

    await expect(todoPage.lblCountTodo).toContainText('1 item left');
    expect(await todoPage.lblTodoTitle.count()).toBe(1);
    expect(await todoPage.lblTodoTitle.first().textContent()).toEqual(todoTitle)
  });
})

test.describe('Failed Add ToDo', async() => {
  test('TWEB0002-Verify failed to add new todo when todo value is space only', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.goto();
    const spaceOnlyText = '        '
    await todoPage.addSingleTodo(spaceOnlyText);

    await expect(todoPage.lblCountTodo).toBeHidden();
    expect(await todoPage.txtTodoField.inputValue()).toEqual(spaceOnlyText)
  });
})