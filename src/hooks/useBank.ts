import { useContext } from 'react';
import { Context as BanksContext } from '../contexts/Banks';
import { Bank, ContractName } from '../tomb-finance';

const useBank = (name: ContractName): Bank => {
  const { banks } = useContext(BanksContext);
  return banks.find((bank) => bank.identifier === name);
};

export default useBank;
