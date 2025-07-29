import { Account } from "../account";

describe("Account", () => {
  let account: Account;

  beforeEach(() => {
    account = new Account("1234567890123456", 100); // Valid account number
  });

  test("should create an account with a valid account number", () => {
    expect(account.accountNo).toBe("1234567890123456");
    expect(account.balance).toBe(100);
  });

  test("should throw an error for invalid account number", () => {
    expect(() => new Account("123", 100)).toThrow(
      "Invalid account number: 123. Must be 16 digits."
    );
  });

  test("should withdraw an amount", () => {
    account.withdraw(50);
    expect(account.balance).toBe(50);
  });

  test("should throw an error for insufficient funds", () => {
    expect(() => account.withdraw(200)).toThrow("Insufficient funds");
  });
});
