
# WEB & API Automation

This project is contains of API and WEB automation as one of my portfolios to give an idea how I create the test cases of specific products and how to automate them.

These automation are based on my own creation of test cases that can be found in document below.

[Test Cases List](https://docs.google.com/spreadsheets/d/1bZQmg9Xr3xDJ8MC2gEJfbJqCxykb5DhwpTYNljcVPyI/edit?usp=sharing)

- WEB https://demo.playwright.dev/todomvc/#/
- API https://gorest.co.in/

As an introduction, those test cases has been created to test product of ToDo list App for WEB and User & Todo endpoint for API.

## Installation

Before starting the installation, please be sure to fulfill the requirement.

- Node v16.13.2 or later
- NPM v8.1.2 or later

Then open terminal to run these command to install.

```bash
  npm install typescript -g
  npm install 
  npx playwright install chrome
```
Then all set!


## How to Run

The API and WEB test scenarios are divided by folder inside `tests` folder. After all the installation process finished, here are the command to run the test in local.

Before running, do not forget to create new file named `.env` and copy all the values as the same as in `.env.sample` file.

```
RETRY=1
WORKER=2
HEADLESS=true
API_BASE_URL=https://gorest.co.in
API_TOKEN=<token_here>
BASE_URL=https://demo.playwright.dev/todomvc
```

PS.
The API automation need token to do the POST, PATCH, and DELETE request. Follow the step to getting the token in https://gorest.co.in/consumer/login and paste the token in `API_TOKEN` value of `.env` file.

#### NPX Command Line

Running command are the same both for API and WEB, only need to define the project name to define which automation platform to test.

```
   npx playwright test --project=api

   npx playwright test --project=web
```

Or remove the `--project` flag to run both of API and WEB at the same time.
