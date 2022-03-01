import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  incoming: number;
  outbound: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { incoming, outbound } = transactions.reduce(
      (accumulator: Omit<Balance, 'total'>, transaction: Transaction) => {
        switch (transaction.type) {
          case 'incoming':
            accumulator.incoming += Number(transaction.value);
            break;

          case 'outbound':
            accumulator.outbound += Number(transaction.value);
            break;

          default:
            break;
        }

        return accumulator;
      },
      {
        incoming: 0,
        outbound: 0,
      }
    );

    const total = incoming - outbound;

    return { incoming, outbound, total };
  }
}

export default TransactionsRepository;
