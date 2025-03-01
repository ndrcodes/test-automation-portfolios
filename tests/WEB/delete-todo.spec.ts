import { test, expect } from '@playwright/test';
import { TodoPage } from '../../pages/todo.pages';
import { generateRandomTodo } from '../../helper/web-helper';

test.describe('Success to Delete Completed ToDo', async() => {
  test('TWEB0017-Success to delete completed todo', async ({ page }) => {
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
    await todoPage.lblTodoTitle.first().hover();
    await todoPage.btnDeleteSingleTodo.first().click();

    await expect(todoPage.lblCountTodo).not.toBeVisible();
    await expect(todoPage.lblTodoTitle).not.toBeVisible();
  });
})

test.describe('Success to Delete Active ToDo', async() => {
  test('TWEB0018-Success to delete active todo', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.goto();
    const todoTitle = await generateRandomTodo('with-emoji');
    await todoPage.addSingleTodo(todoTitle);

    await expect(todoPage.lblCountTodo).toContainText('1 item left');
    expect(await todoPage.lblTodoTitle.count()).toBe(1);
    expect(await todoPage.lblTodoTitle.first().textContent()).toEqual(todoTitle)

    await todoPage.btnTabActive.click();
    await todoPage.lblTodoTitle.first().hover();
    await todoPage.btnDeleteSingleTodo.first().click();

    await expect(todoPage.lblCountTodo).not.toBeVisible();
    await expect(todoPage.lblTodoTitle).not.toBeVisible();
  });
})

test.describe('Success to Delete ToDo with clear completed button', async() => {
  test('TWEB0022-Verify the appearance of Clear Completed button', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.goto();
    const todoTitle = await generateRandomTodo('with-emoji');
    await todoPage.addSingleTodo(todoTitle);

    await expect(todoPage.lblCountTodo).toContainText('1 item left');
    expect(await todoPage.lblTodoTitle.count()).toBe(1);
    expect(await todoPage.lblTodoTitle.first().textContent()).toEqual(todoTitle)
    await expect(todoPage.btnClearCompletedTodo).not.toBeVisible();

    await todoPage.checkTodoAs(1, 'completed');
    await expect(todoPage.lblCountTodo).toContainText('0 items left');
    await expect(todoPage.btnClearCompletedTodo).toBeVisible();

    await todoPage.checkTodoAs(1, 'active');
    await expect(todoPage.lblCountTodo).toContainText('1 item left');
    await expect(todoPage.btnClearCompletedTodo).not.toBeVisible();
  });

  test('TWEB0023-Success to delete all completed todo by click Clear Completed', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.goto();
    const todoTitle = await generateRandomTodo('with-emoji');
    await todoPage.addSingleTodo(todoTitle);

    await expect(todoPage.lblCountTodo).toContainText('1 item left');
    expect(await todoPage.lblTodoTitle.count()).toBe(1);
    expect(await todoPage.lblTodoTitle.first().textContent()).toEqual(todoTitle);

    await todoPage.checkTodoAs(1, 'completed');
    await expect(todoPage.lblCountTodo).toContainText('0 items left');
    await expect(todoPage.btnClearCompletedTodo).toBeVisible();
    await todoPage.btnClearCompletedTodo.click();

    await expect(todoPage.btnClearCompletedTodo).not.toBeVisible();
    await expect(todoPage.btnTabActive).not.toBeVisible();
    await expect(todoPage.btnTabAll).not.toBeVisible();
    await expect(todoPage.btnTabCompleted).not.toBeVisible();
    await expect(todoPage.lblCountTodo).not.toBeVisible();
    await expect(todoPage.lblTodoTitle).not.toBeVisible();
  });
})