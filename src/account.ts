/**
 * Class for account - (master)
 */
export class Account {
  constructor(public readonly accountNo: string, private _balance: number) {
    if (!this.isValidAccountNo()) {
      throw new Error(
        `Invalid account number: ${accountNo}. Must be 16 digits.`
      );
    }
  }

  private isValidAccountNo(): boolean {
    return /^\d{16}$/.test(this.accountNo);
  }

  public withdraw(amount: number): void {
    if (amount <= 0) throw new Error("Amount must be positive");
    if (this._balance < amount) throw new Error("Insufficient funds");
    this._balance -= amount;
  }

  public deposit(amount: number): void {
    if (amount <= 0) throw new Error("Amount must be positive");
    this._balance += amount;
  }

  public get balance(): number {
    return this._balance;
  }
}
