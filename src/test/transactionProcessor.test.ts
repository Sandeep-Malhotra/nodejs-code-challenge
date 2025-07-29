import { Transaction } from "../transaction";
import {
  TransactionProcessor,
  TransactionResult,
} from "../transactionProcessor";
import { Account } from "../account";

jest.mock("../Account"); // Mock the Account class

describe("TransactionProcessor", () => {
  let processor: TransactionProcessor;
  let mockFromAccount: jest.Mocked<Account>;
  let mockToAccount: jest.Mocked<Account>;
  let accounts: Map<string, Account>;
  const validAccount1 = "1234567890123456";
  const validAccount2 = "9876543210987654";
  const validAmount = 100;

  beforeEach(() => {
    // Create mock Account instances
    mockFromAccount = {
      withdraw: jest.fn(),
      deposit: jest.fn(),
      balance: 200, // Mock balance getter
      accountNo: validAccount1,
    } as any;
    mockToAccount = {
      withdraw: jest.fn(),
      deposit: jest.fn(),
      balance: 50,
      accountNo: validAccount2,
    } as any;

    // Initialize accounts map
    accounts = new Map([
      [validAccount1, mockFromAccount],
      [validAccount2, mockToAccount],
    ]);

    // Initialize processor
    processor = new TransactionProcessor(accounts);
    jest.clearAllMocks();
  });

  test("should process a transaction successfully", () => {
    const transaction = new Transaction(
      validAccount1,
      validAccount2,
      validAmount
    );
    const result = processor.processTransaction(transaction);

    expect(mockFromAccount.withdraw).toHaveBeenCalledWith(validAmount);
    expect(mockToAccount.deposit).toHaveBeenCalledWith(validAmount);
    expect(result).toEqual(new TransactionResult(transaction, "SUCCESS"));
  });

  test("should fail transaction if insufficient funds in fromAccount", () => {
    const transaction = new Transaction(
      validAccount1,
      validAccount2,
      validAmount
    );
    mockFromAccount.withdraw.mockImplementation(() => {
      throw new Error("Insufficient funds");
    });

    const result = processor.processTransaction(transaction);

    expect(mockFromAccount.withdraw).toHaveBeenCalledWith(validAmount);
    expect(mockToAccount.deposit).not.toHaveBeenCalled();
    expect(result).toEqual(
      new TransactionResult(transaction, "FAILED", "Insufficient funds")
    );
  });
});
