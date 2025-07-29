import * as fs from "fs";
import csvParser from "csv-parser";
import { stringify } from "csv-stringify";

interface AccountRow {
  accountNo: string;
  balance: string;
}

interface TransactionRow {
  fromAccount: string;
  toAccount: string;
  amount: string;
}
/**
 * Class to Read and Write CSV files
 */
export class CSVProcessor {
  private batchSize: number;

  constructor(batchSize: number) {
    this.batchSize = batchSize;
  }

  public async loadAccountsInBatch(
    filePath: string
  ): Promise<Map<string, string>> {
    const accountMap = new Map<string, string>();
    let accountBatch: AccountRow[] = [];
    const stream = fs.createReadStream(filePath).pipe(
      csvParser({
        headers: false,
      })
    );

    for await (const row of stream) {
      const accountRow: AccountRow = {
        accountNo: row[0],
        balance: row[1],
      };
      accountBatch.push(accountRow);

      if (accountBatch.length >= this.batchSize) {
        for (const account of accountBatch.splice(0, this.batchSize)) {
          accountMap.set(account.accountNo, account.balance);
        }
      }
    }

    // Process any remaining accounts in the batch
    if (accountBatch.length > 0) {
      for (const account of accountBatch) {
        accountMap.set(account.accountNo, account.balance);
      }
    }

    return accountMap;
  }

  public async loadTransactionsInBatch(
    filePath: string
  ): Promise<{ fromAccount: string; toAccount: string; amount: string }[]> {
    const transactions: {
      fromAccount: string;
      toAccount: string;
      amount: string;
    }[] = [];
    let transactionBatch: TransactionRow[] = [];
    const stream = fs.createReadStream(filePath).pipe(
      csvParser({
        headers: false,
      })
    );

    for await (const row of stream) {
      const transactionRow: TransactionRow = {
        fromAccount: row[0],
        toAccount: row[1],
        amount: row[2],
      };
      transactionBatch.push(transactionRow);

      if (transactionBatch.length >= this.batchSize) {
        for (const transaction of transactionBatch.splice(0, this.batchSize)) {
          transactions.push({
            fromAccount: transaction.fromAccount,
            toAccount: transaction.toAccount,
            amount: transaction.amount,
          });
        }
      }
    }

    // Process any remaining transactions in the batch
    if (transactionBatch.length > 0) {
      for (const transaction of transactionBatch) {
        transactions.push({
          fromAccount: transaction.fromAccount,
          toAccount: transaction.toAccount,
          amount: transaction.amount,
        });
      }
    }

    return transactions;
  }

  public async writeTransactionResultsInBatch(
    outputPath: string,
    results: {
      transaction: { fromAccount: string; toAccount: string; amount: number };
      status: string;
      reason?: string;
    }[]
  ): Promise<void> {
    const writeStream = fs.createWriteStream(outputPath);
    writeStream.write("fromAccount,toAccount,amount,status,reason\n"); // Write header

    const batchSize = this.batchSize;

    for (let i = 0; i < results.length; i += batchSize) {
      const batch = results.slice(i, i + batchSize);

      const data = batch.map((result) => ({
        fromAccount: result.transaction.fromAccount,
        toAccount: result.transaction.toAccount,
        amount: result.transaction.amount,
        status: result.status,
        reason: result.reason || "",
      }));

      const output = await new Promise<string>((resolve, reject) => {
        stringify(data, { header: false }, (err, output) => {
          if (err) reject(err);
          else resolve(output);
        });
      });

      writeStream.write(output);
    }

    writeStream.end(); // Close the stream
  }
}
