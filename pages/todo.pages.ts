import { faker } from '@faker-js/faker';
import { type Page, type Locator, expect } from '@playwright/test';
import { waitForElement } from '../helper/web-helper';
import { setup } from '../helper/setup';

export class TodoPage {
  constructor(
    public page: Page,
    public txtTodoField: Locator = page.locator('.new-todo'),
    public lblTodoTitle: Locator = page.locator('//label[@data-testid="todo-title"]'),
    public btnMarkTodo: Locator = page.locator('//ul[@class="todo-list"]//input[@type="checkbox"]'),
    public btnDeleteSingleTodo: Locator = page.locator('//button[@class="destroy"]'),

    public txtEditField: Locator = page.locator('//input[@class="edit"]'),
    public lblCountTodo: Locator = page.locator('//span[@data-testid="todo-count"]'),
    public btnTabAll: Locator = page.locator('//a[text()="All"]'),
    public btnTabActive: Locator = page.locator('//a[text()="Active"]'),
    public btnTabCompleted: Locator = page.locator('//a[text()="Completed"]'),
    public btnClearCompletedTodo: Locator = page.locator('//button[@class="clear-completed"]'),
  ) {}

  async goto() {
    await this.page.goto(setup.baseUrl);
  }

  async addSingleTodo(title: string = 'random') {
    let value: string;
    if (title == 'random') {
      value = faker.word.verb();
    } else {
      value = title;
    }

    await waitForElement(this.txtTodoField);
    await this.txtTodoField.fill(value);
    await this.page.keyboard.press('Enter');

    return value;
  }

  async addMultipleTodo(count: number) {
    let todoTitles = [];
    for (let i = 0; i < count; i++) {
      const todoTitle = await this.addSingleTodo('random');
      todoTitles.push(todoTitle)
    }

    return todoTitles
  }

  async editSingleTodo(index: number, currentValue: string, newValue: string = null) {
    let editedValue: string;
    const suffix = '-edited'
    const todoElement = this.lblTodoTitle.nth(index - 1)
    await waitForElement(todoElement);

    await todoElement.dblclick();

    if (!newValue) {
      editedValue = currentValue + suffix
      await this.page.keyboard.type(suffix);
    } else {
      editedValue = newValue;
      await this.txtEditField.nth(index - 1).fill(editedValue)
    }
    
    await this.page.keyboard.press('Enter');

    return editedValue
  }

  async checkTodoAs(index: number, status: 'completed' | 'active') {
    const todoElement = this.btnMarkTodo.nth(index - 1)
    await waitForElement(todoElement);
    if (status == 'completed') {
      await expect(todoElement).not.toBeChecked();
    } else {
      await expect(todoElement).toBeChecked();
    }
    await todoElement.click();
  }
}