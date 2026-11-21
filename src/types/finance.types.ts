import type {
  FinanceCategoryRow,
  FinanceRecordRow,
  FinanceType,
  FinancialSummary,
  PublicFinanceRecordRow,
} from "./database.types";

export type {
  FinanceCategoryRow,
  FinanceRecordRow,
  FinanceType,
  FinancialSummary,
  PublicFinanceRecordRow,
};

export interface PublicTransactionItem {
  id: string;
  title: string;
  amount: number;
  type: FinanceType;
  categoryId: string | null;
  categoryName: string;
  transactionDate: string;
  createdAt: string;
}

export interface VaultTransactionItem extends PublicTransactionItem {
  receiptUrl: string | null;
  notes: string | null;
  recordedBy: string | null;
}

export interface ActionResult<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}
