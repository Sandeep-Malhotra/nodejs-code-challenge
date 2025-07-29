/**
 * Class for transaction - (master)
 */
export class Transaction {
  constructor(
    public readonly fromAccount: string, // Account number reference
    public readonly toAccount: string, // Account number reference
    public readonly amount: number
  ) {
    if (amount <= 0) throw new Error("Transaction amount must be positive");
    if (fromAccount === toAccount)
      throw new Error("Cannot transfer to the same account");
    if (!this.isValidAccountNumber(fromAccount)) {
      throw new Error(
        `Invalid fromAccount number: ${fromAccount}. Must be 16 digits.`
      );
    }
    if (!this.isValidAccountNumber(toAccount)) {
      throw new Error(
        `Invalid toAccount number: ${toAccount}. Must be 16 digits.`
      );
    }
  }
  private isValidAccountNumber(accountNo: string): boolean {
    return /^\d{16}$/.test(accountNo);
  }
}
