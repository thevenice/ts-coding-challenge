# tha-coding-challenge

This coding challenge uses [Cucumber](https://cucumber.io/) to run tests which implement a hypothetical use-case for Hedera SDK.

## How to Solve It

### 1. Fork the Repository

Go to the GitHub repository and fork it into your own account.

### 2. Clone Your Fork

Clone your forked repository to your local machine.

### 3. Setup the Environment

Navigate to the project directory and setup the environment by following the instructions in the section [Installation](#installation).

### 4. Understand the Codebase and review existing tests

Familiarize yourself with the structure of the project with the following key files and folders:

- `features/`: Contains `Cucumber` feature files (`*.feature`) that define test scenarios for consensus and token services.

- `features/step_definitions/`: Contains TypeScript implementation files for the test scenarios. The implementation is incomplete causing the tests to fail.

- `src/`: Contains utility functions and configurations.

Additional information can be found in the section [Writing the tests](#writing-the-tests).

### 5. Implement Missing Functionality

Complete the code in the relevant files to ensure that all test cases can be executed successfully.

Utilize the Hedera SDK to create topics, publish messages, and manage tokens as required by the tests.

Refer to the Hedera documentation and learning resources provided in the section [Learning resources](#learning-resources) for guidance on using the Hedera SDK.

### 6. Running Tests

You can run all tests using the commands provided in the section [Running](#running).

### 7. Submitting the Updated Code

After ensuring that all tests pass, commit your changes and push your changes to your forked repository.

## ⚠️ Important Notes

You should not edit the test files (`*.features`). Your task is to complete the existing code to in the Typescript files (`*.ts`) to ensure that the tests pass successfully. Focus solely on implementing the required functionality.

## Installation

to install the dependencies, run `pnpm install` after enabling the corepack: `corepack enable`

## Environment Variables

The project now uses environment variables for Hedera testnet accounts. 

### Setup

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** with your testnet account details:
   ```env
   ACCOUNT_ID=0.0.YOUR_ACCOUNT_ID
   ACCOUNT_PRIVATE_KEY=YOUR_PRIVATE_KEY_IN_DER_FORMAT
   ```
   
   **Note:** The project uses a single account for all operations. All test scenarios will use this one account.

3. **Get testnet accounts:**
   - Visit https://portal.hedera.com
   - Create testnet accounts
   - Get account IDs and private keys
   - Private keys should be in DER format (starts with `302e...`)

4. **Security Note:**
   - The `.env` file is already in `.gitignore`
   - Never commit your `.env` file to version control
   - The project will fall back to default testnet accounts if `.env` is not found

### Account Format

- **Account ID**: Format `0.0.XXXXXXX` (e.g., `0.0.7327357`)
- **Private Key**: DER format string (e.g., `302e020100300506032b657004220420...`)
- **Single Account**: The project uses one account (`ACCOUNT_ID` and `ACCOUNT_PRIVATE_KEY`) for all operations

## Running

To run the tests you have multiple options:

- run `pnpm test` to run all steps
- run `pnpm test:dev` to run all steps marked with the `@dev` tag
- run `pnpm test:wip` to run all steps marked with the `@wip` tag
- create your own tag and run the tests with `cucumber-js -p default --tags 'not @wip' --exit`

## Writing the tests

The tests are implemented as `steps` in the `features` folder. You can use a plugin to your favourite IDE to write
the step definitions for you. An example has been left for reference

The `config.ts` contains a list of private keys which can be used for testing. You can also replace those keys with
the ones from your own Hedera Console test accounts.

If you need more testnet accounts, you can:

- Register on the [Hedera Portal](https://portal.hedera.com/register) - easiest way
- Create a testnet account in a Hedera Wallet like [Hashpack](https://www.hashpack.app/) or [Blade](https://bladewallet.io/) and using [the faucet](https://portal.hedera.com) - more work but allows to better understand what is going on

## Learning resources

You can download a [presentation providing an overview of Hedera Hashgraph](https://hashgraph.atlassian.net/wiki/external/NTdiYjA4ZDZiMWQxNDAzNjg4NTI3ODgyZjE0YzU1MjY) and how to use its services

For the impatient, here are the main links for learning material:

- [Getting Started](https://hedera.com/get-started)
- [Hedera documentation](https://docs.hedera.com/hedera)
- [Hedera Learning Center](https://hedera.com/learning/what-is-hedera-hashgraph)
- [Join developer discord](https://hedera.com/discord)
- [Hedera on Youtube](https://www.youtube.com/c/HederaHashgraph)
- [Application demos](https://docs.hedera.com/guides/resources/demo-applications)
