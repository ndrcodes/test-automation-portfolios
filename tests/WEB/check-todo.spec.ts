import { test, expect } from '@playwright/test';
import { TodoPage } from '../../pages/todo.pages';
import { generateRandomTodo } from '../../helper/web-helper';

test.describe('Success to Checked ToDo', async() => {
  test('TWEB0013,TWEB0014-Success to check todo as completed', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.goto();
    const todoTitle = await generateRandomTodo('with-emoji');
    await todoPage.addSingleTodo(todoTitle);

    await expect(todoPage.lblCountTodo).toContainText('1 item left');
    expect(await todoPage.lblTodoTitle.count()).toBe(1);
    expect(await todoPage.lblTodoTitle.first().textContent()).toEqual(todoTitle)

    await todoPage.checkTodoAs(1, 'completed');
    await expect(todoPage.lblCountTodo).toContainText('0 items left');
  });
})

test.describe('Success to Unchecked ToDo', async() => {
  test('TWEB0015,TWEB0016-Success to uncheck todo as active', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.goto();
    const todoTitle = await generateRandomTodo('with-emoji');
    await todoPage.addSingleTodo(todoTitle);

    await expect(todoPage.lblCountTodo).toContainText('1 item left');
    expect(await todoPage.lblTodoTitle.count()).toBe(1);
    expect(await todoPage.lblTodoTitle.first().textContent()).toEqual(todoTitle)

    await todoPage.checkTodoAs(1, 'completed');
    await expect(todoPage.lblCountTodo).toContainText('0 items left');

    await todoPage.btnTabCompleted.click();
    await todoPage.checkTodoAs(1, 'active');
    await expect(todoPage.lblCountTodo).toContainText('1 item left');

    await todoPage.btnTabActive.click();
    await expect(todoPage.lblCountTodo).toContainText('1 item left');
    expect(await todoPage.lblTodoTitle.count()).toBe(1);
    expect(await todoPage.lblTodoTitle.first().textContent()).toEqual(todoTitle)
  });
})