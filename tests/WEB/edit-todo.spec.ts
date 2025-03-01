import { test, expect } from '@playwright/test';
import { TodoPage } from '../../pages/todo.pages';
import { generateRandomTodo } from '../../helper/web-helper';

test.describe('Success to Edit Existing ToDo', async() => {
  test('TWEB0008,TWEB0009,TWEB0012-Verify able to edit existing todo by double click the text', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.goto();
    const todoTitle = await todoPage.addSingleTodo('random');

    await expect(todoPage.lblCountTodo).toContainText('1 item left');
    expect(await todoPage.lblTodoTitle.count()).toBe(1);
    expect(await todoPage.lblTodoTitle.first().textContent()).toEqual(todoTitle)

    const newUpdatedTitle = await generateRandomTodo('with-emoji');
    const updatedTodoTitle = await todoPage.editSingleTodo(1, todoTitle, newUpdatedTitle);

    await expect(todoPage.lblCountTodo).toContainText('1 item left');
    expect(await todoPage.lblTodoTitle.count()).toBe(1);
    expect(await todoPage.lblTodoTitle.first().textContent()).toEqual(updatedTodoTitle)
  });

  test('TWEB0010-Check todo is updated when edit todo with value as same as existing value', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.goto();
    const todoCount = 2;
    const todoTitles = await todoPage.addMultipleTodo(todoCount);

    expect(await todoPage.lblTodoTitle.count()).toBe(todoCount);

    const updatedTodoTitle = await todoPage.editSingleTodo(1, todoTitles[0], todoTitles[1]);

    await expect(todoPage.lblCountTodo).toContainText('2 items left');
    expect(await todoPage.lblTodoTitle.count()).toBe(todoCount);
    expect(await todoPage.lblTodoTitle.first().textContent()).toEqual(updatedTodoTitle)
    expect(await todoPage.lblTodoTitle.last().textContent()).toEqual(updatedTodoTitle)
  });
})

test.describe('Failed to Edit Existing ToDo', async() => {
  test('TWEB0011-Verify todo is automatically deleted when edit todo with space only text', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.goto();
    const todoTitle = await todoPage.addSingleTodo('random');

    await expect(todoPage.lblCountTodo).toContainText('1 item left');
    expect(await todoPage.lblTodoTitle.count()).toBe(1);
    expect(await todoPage.lblTodoTitle.first().textContent()).toEqual(todoTitle)

    const spaceOnlyText = '     '
    await todoPage.editSingleTodo(1, todoTitle, spaceOnlyText);

    await expect(todoPage.lblCountTodo).toBeHidden();
  });
})