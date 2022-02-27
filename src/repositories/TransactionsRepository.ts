import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'incoming' | 'outbound';
}
interface Balance {
  incoming: number;
  outbound: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const { incoming, outbound } = this.transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        switch (transaction.type) {
          case 'incoming':
            accumulator.incoming += transaction.value;
            break;
          case 'outbound':
            accumulator.outbound += transaction.value;
            break;
          default:
            break;
        }

        return accumulator;
      },
      {
        incoming: 0,
        outbound: 0,
        total: 0,
      }
    );

    const total = incoming - outbound;

    return { incoming, outbound, total };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({
      title,
      value,
      type,
    });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
