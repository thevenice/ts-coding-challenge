import { Given, Then, When } from "@cucumber/cucumber";
import {
  AccountBalanceQuery,
  AccountId,
  Client,
  PrivateKey,
  TopicCreateTransaction,
  TopicInfoQuery,
  TopicMessageQuery,
  TopicMessageSubmitTransaction,
  KeyList
} from "@hashgraph/sdk";
import { accounts } from "../../src/config";
import assert from "node:assert";

// Pre-configured client for test network (testnet)
const client = Client.forTestnet()

//Set the operator with the account ID and private key

Given(/^a first account with more than (\d+) hbars$/, async function (expectedBalance: number) {
  const acc = accounts[0]
  const account: AccountId = AccountId.fromString(acc.id);
  this.account = account
  // Handle both DER format and raw hex format
  const privKey: PrivateKey = acc.privateKey.length > 64 
    ? PrivateKey.fromString(acc.privateKey)
    : PrivateKey.fromStringED25519(acc.privateKey);
  this.privKey = privKey
  client.setOperator(this.account, privKey);

//Create the query request
  const query = new AccountBalanceQuery().setAccountId(account);
  const balance = await query.execute(client)
  assert.ok(balance.hbars.toBigNumber().toNumber() > expectedBalance)
});

When(/^A topic is created with the memo "([^"]*)" with the first account as the submit key$/, async function (memo: string) {
  const transaction = await new TopicCreateTransaction()
    .setTopicMemo(memo)
    .setSubmitKey(this.privKey.publicKey)
    .execute(client);
  
  const receipt = await transaction.getReceipt(client);
  this.topicId = receipt.topicId;
  assert.ok(this.topicId !== null);
});

When(/^The message "([^"]*)" is published to the topic$/, async function (message: string) {
  let transaction = new TopicMessageSubmitTransaction()
    .setTopicId(this.topicId)
    .setMessage(message);
  
  // If threshold key exists, we need to sign with one of the keys
  if (this.thresholdKey) {
    // Sign with the first account's private key (1 of 2 threshold)
    transaction = transaction.freezeWith(client);
    transaction = await transaction.sign(this.privKey);
  }
  
  const executedTransaction = await transaction.execute(client);
  const receipt = await executedTransaction.getReceipt(client);
  assert.ok(receipt.status.toString() === "SUCCESS");
  this.publishedMessage = message;
});

Then(/^The message "([^"]*)" is received by the topic and can be printed to the console$/, async function (message: string) {
  return new Promise<void>((resolve, reject) => {
    // Set start time to 1 minute ago to catch recently published messages
    const startTime = new Date(Date.now() - 60000);
    const query = new TopicMessageQuery()
      .setTopicId(this.topicId)
      .setStartTime(startTime);
    
    let messageReceived = false;
    const timeout = setTimeout(() => {
      if (!messageReceived) {
        reject(new Error("Message not received within timeout"));
      }
    }, 30000);
    
    query.subscribe(client, null, (messageResponse) => {
      const receivedMessage = Buffer.from(messageResponse.contents).toString();
      console.log("Received message:", receivedMessage);
      if (receivedMessage === message) {
        messageReceived = true;
        clearTimeout(timeout);
        resolve();
      }
    });
  });
});

Given(/^A second account with more than (\d+) hbars$/, async function (expectedBalance: number) {
  // Use the same account for second account (single account setup)
  const acc = accounts[0];
  const account: AccountId = AccountId.fromString(acc.id);
  this.secondAccount = account;
  // Handle both DER format and raw hex format
  const privKey: PrivateKey = acc.privateKey.length > 64 
    ? PrivateKey.fromString(acc.privateKey)
    : PrivateKey.fromStringED25519(acc.privateKey);
  this.secondPrivKey = privKey;
  
  const query = new AccountBalanceQuery().setAccountId(account);
  const balance = await query.execute(client);
  assert.ok(balance.hbars.toBigNumber().toNumber() > expectedBalance);
});

Given(/^A (\d+) of (\d+) threshold key with the first and second account$/, async function (threshold: number, total: number) {
  const keyList = new KeyList();
  keyList.push(this.privKey.publicKey);
  keyList.push(this.secondPrivKey.publicKey);
  keyList.setThreshold(threshold);
  
  this.thresholdKey = keyList;
});

When(/^A topic is created with the memo "([^"]*)" with the threshold key as the submit key$/, async function (memo: string) {
  const transaction = await new TopicCreateTransaction()
    .setTopicMemo(memo)
    .setSubmitKey(this.thresholdKey)
    .execute(client);
  
  const receipt = await transaction.getReceipt(client);
  this.topicId = receipt.topicId;
  assert.ok(this.topicId !== null);
});
