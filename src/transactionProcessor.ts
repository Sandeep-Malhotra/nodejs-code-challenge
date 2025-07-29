import { Account } from "./account";
import { Transaction } from "./transaction";

/**
 *  Output strcuture of Transaction
 */
export class TransactionResult {
  constructor(
    public readonly transaction: Transaction,
    public readonly status: "SUCCESS" | "FAILED",
    public readonly reason?: string
  ) {}
}

/**
 * Class to process transaction
 */
export class TransactionProcessor {
  constructor(private accounts: Map<string, Account>) {}

  public processTransaction(transaction: Transaction): TransactionResult {
    try {
      // Get accounts from the map
      const fromAccount = this.accounts.get(transaction.fromAccount);
      const toAccount = this.accounts.get(transaction.toAccount);

      // Check if accounts exist
      if (!fromAccount || !toAccount) {
        const missingAccount = !fromAccount
          ? transaction.fromAccount
          : transaction.toAccount;
        return new TransactionResult(
          transaction,
          "FAILED",
          `Account ${missingAccount} not found`
        );
      }

      // Process the transaction
      fromAccount.withdraw(transaction.amount);
      toAccount.deposit(transaction.amount);

      return new TransactionResult(transaction, "SUCCESS");
    } catch (error) {
      return new TransactionResult(
        transaction,
        "FAILED",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  public processAllTransactions(
    transactions: Transaction[]
  ): TransactionResult[] {
    const results: TransactionResult[] = [];

    for (const transaction of transactions) {
      const result = this.processTransaction(transaction);
      results.push(result);
    }

    return results;
  }
}
