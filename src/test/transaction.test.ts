import { Transaction } from "../transaction";
describe("Transaction", () => {
  const validAccount1 = "1234567890123456";
  const validAccount2 = "9876543210987654";
  const validAmount = 100;

  test("should create a transaction with valid inputs", () => {
    const transaction = new Transaction(
      validAccount1,
      validAccount2,
      validAmount
    );
    expect(transaction.fromAccount).toBe(validAccount1);
    expect(transaction.toAccount).toBe(validAccount2);
    expect(transaction.amount).toBe(validAmount);
  });

  test("should throw error when fromAccount and toAccount are the same", () => {
    expect(
      () => new Transaction(validAccount1, validAccount1, validAmount)
    ).toThrow("Cannot transfer to the same account");
  });

  test("should throw error for invalid fromAccount (not 16 digits)", () => {
    expect(() => new Transaction("12345", validAccount2, validAmount)).toThrow(
      "Invalid fromAccount number: 12345. Must be 16 digits."
    );
    expect(
      () => new Transaction("123456789012345a", validAccount2, validAmount)
    ).toThrow(
      "Invalid fromAccount number: 123456789012345a. Must be 16 digits."
    );
    expect(() => new Transaction("", validAccount2, validAmount)).toThrow(
      "Invalid fromAccount number: . Must be 16 digits."
    );
  });

  test("should throw error for invalid toAccount (not 16 digits)", () => {
    expect(() => new Transaction(validAccount1, "12345", validAmount)).toThrow(
      "Invalid toAccount number: 12345. Must be 16 digits."
    );
    expect(
      () => new Transaction(validAccount1, "123456789012345a", validAmount)
    ).toThrow("Invalid toAccount number: 123456789012345a. Must be 16 digits.");
    expect(() => new Transaction(validAccount1, "", validAmount)).toThrow(
      "Invalid toAccount number: . Must be 16 digits."
    );
  });
});
