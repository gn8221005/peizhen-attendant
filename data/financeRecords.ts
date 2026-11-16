export type FinanceRecordStatus = 'processing' | 'success' | 'failed'

export interface IncomeRecord {
  id: number
  title: string
  statusLabel: string
  time: string
  amount: string
}

export interface WithdrawalRecord {
  id: number
  status: FinanceRecordStatus
  title: string
  time: string
  amount: string
}

export const incomeRecords: IncomeRecord[] = [
  { id: 1, title: '订单收益', statusLabel: '收入', time: '2025-11-20 09:27:42', amount: '29.50' },
  { id: 2, title: '订单收益', statusLabel: '收入', time: '2026-06-24 22:40:00', amount: '0.00' }
]

export const withdrawRecords: WithdrawalRecord[] = [
  { id: 1, status: 'processing', title: '提现中', time: '2026-05-29 20:35:46', amount: '1.00' },
  { id: 2, status: 'processing', title: '提现中', time: '2026-05-28 14:02:30', amount: '1.00' },
  { id: 3, status: 'success', title: '提现成功', time: '2026-05-28 14:00:56', amount: '1.00' },
  { id: 4, status: 'success', title: '提现成功', time: '2025-12-16 09:40:41', amount: '10.00' }
]
