import { test, expect } from '@playwright/test';
import { TodoPage } from '../../pages/todo.pages';

test.describe('Success Validate Index ToDo', async() => {
  test('TWEB0019,TWEB0020,TWEB0021-Verify the todo data shown in All, Active, and Completed tab', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.goto();
    const completeTodoTitle = await todoPage.addSingleTodo('complete-todo');
    const activeTodoTitle = await todoPage.addSingleTodo('active-todo');

    await expect(todoPage.lblCountTodo).toContainText('2 items left');
    expect(await todoPage.lblTodoTitle.count()).toBe(2);
    expect(await todoPage.lblTodoTitle.first().textContent()).toEqual(completeTodoTitle)
    expect(await todoPage.lblTodoTitle.last().textContent()).toEqual(activeTodoTitle)

    // mark the first todo as completed
    await todoPage.checkTodoAs(1, 'completed');
    await expect(todoPage.lblCountTodo).toContainText('1 item left');
    expect(await todoPage.lblTodoTitle.count()).toBe(2);

    // check on Active tab
    await todoPage.btnTabActive.click();
    expect(await todoPage.lblTodoTitle.first().textContent()).toEqual(activeTodoTitle)
    expect(await todoPage.lblTodoTitle.count()).toBe(1);

    // check on Completed tab
    await todoPage.btnTabCompleted.click();
    expect(await todoPage.lblTodoTitle.first().textContent()).toEqual(completeTodoTitle)
    expect(await todoPage.lblTodoTitle.count()).toBe(1);
  });
})