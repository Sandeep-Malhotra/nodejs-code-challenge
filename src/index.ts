import * as path from "path";
import { CSVProcessor } from "./csvProcessor";
import { Account } from "./account";
import { Transaction } from "./transaction";
import { TransactionProcessor } from "./transactionProcessor";

const main = async () => {
  const processor = new CSVProcessor(50);
  const accountsFilePath = path.join(
    __dirname,
    "..",
    "src",
    "csv",
    "mable_account_balances.csv"
  );

  const transactionsFilePath = path.join(
    __dirname,
    "..",
    "src",
    "csv",
    "mable_transactions.csv"
  );
  // Load accounts and transactions from csv file
  const [accountData, transactionsData] = await Promise.all([
    processor.loadAccountsInBatch(accountsFilePath),
    processor.loadTransactionsInBatch(transactionsFilePath),
  ]);

  // Convert account data to Account instances
  const accounts = new Map<string, Account>();
  let invalidCount = 0;
  for (const [accountNo, balance] of accountData) {
    try {
      // Attempt to create an Account instance
      const account = new Account(accountNo, parseFloat(balance));
      accounts.set(accountNo, account);
    } catch (error) {
      const errorMessage = (error as Error).message || "Unknown error";
      console.warn(`Skipping invalid account ${accountNo}: ${errorMessage}`);
      invalidCount++;
    }
  }
  console.log(`Skipped ${invalidCount} invalid accounts`);
  // Convert transactions data to Transaction instances
  const transactions = transactionsData.map(
    (tx) => new Transaction(tx.fromAccount, tx.toAccount, parseFloat(tx.amount))
  );
  // Process transactions
  const transactionProcessor = new TransactionProcessor(accounts);
  const results = transactionProcessor.processAllTransactions(transactions);
  // Write results in csv
  const transactionsOutputFilePath = path.join(
    __dirname,
    "..",
    "src",
    "csv",
    "mable_transactions_results.csv"
  );
  processor.writeTransactionResultsInBatch(transactionsOutputFilePath, results);
};

main();
