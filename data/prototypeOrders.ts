export interface DispatchOrder {
  id: string
  serviceName: string
  hospital: string
  department: string
  appointmentAt: string
  patient: string
  phone: string
  serviceNeed: string
  orderedAt: string
  orderNo: string
  distance: string
  earnings: string
  duration: string
}

export type OrderStatus = 'pending' | 'serving' | 'completed' | 'cancelled'

export interface OrderRecord {
  id: string
  serviceName: string
  hospital: string
  department?: string
  appointmentAt: string
  patient: string
  phone?: string
  visitContent?: string
  orderedAt?: string
  paidAt?: string
  acceptedAt?: string
  cancelledAt?: string
  cancelledBy?: '用户' | '陪诊师'
  cancelledReason?: string
  serviceNeed?: string
  earnings?: string
  status: OrderStatus
  orderNo?: string
  source?: 'dispute'
}

export const dispatchOrders: DispatchOrder[] = [
  {
    id: 'dispatch-001',
    serviceName: '半天院内陪诊',
    hospital: '九江市第一人民医院（总院）',
    department: '心内科',
    appointmentAt: '2026-09-08 08:00',
    patient: '男 56岁 钟离',
    phone: '17888888888',
    serviceNeed: '门诊陪同',
    orderedAt: '2026-09-06 20:12:00',
    orderNo: '178869672000011001',
    distance: '3.2km',
    earnings: '44.50',
    duration: '12小时'
  },
  {
    id: 'dispatch-002',
    serviceName: '全程陪诊',
    hospital: '九江市妇幼保健院',
    department: '妇产科',
    appointmentAt: '2026-09-08 09:30',
    patient: '女 32岁 王女士',
    phone: '13588888888',
    serviceNeed: '产检陪同',
    orderedAt: '2026-09-07 09:30:00',
    orderNo: '178874460000011002',
    distance: '5.8km',
    earnings: '44.50',
    duration: '24小时'
  },
  {
    id: 'dispatch-003',
    serviceName: '代取报告',
    hospital: '九江市中医医院',
    department: '检验科',
    appointmentAt: '2026-09-08 14:00',
    patient: '男 45岁 李先生',
    phone: '13988888888',
    serviceNeed: '代取血常规报告',
    orderedAt: '2026-09-07 15:10:00',
    orderNo: '178876500000011003',
    distance: '7.1km',
    earnings: '44.50',
    duration: '12小时'
  }
]

export const orderRecords: OrderRecord[] = [
  {
    id: 'order-001',
    serviceName: '全天院内陪诊',
    hospital: '九江市第一人民医院（总院）',
    department: '心内科',
    appointmentAt: '2025-12-09 08:00:00',
    patient: '钟离',
    phone: '17888888888',
    visitContent: '门诊陪同',
    orderedAt: '2025-12-08 21:12:32',
    orderNo: '176519955185111001',
    serviceNeed: '全程陪同就诊',
    earnings: '49.50',
    status: 'pending'
  },
  {
    id: 'order-002',
    serviceName: '半天院内陪诊',
    hospital: '九江学院附属医院',
    department: '内科',
    appointmentAt: '2025-12-15 08:00:00',
    patient: '范文',
    phone: '13800000002',
    visitContent: '门诊陪同',
    orderedAt: '2025-12-13 10:20:00',
    orderNo: '176559240000011002',
    serviceNeed: '协助挂号及陪同就诊',
    earnings: '29.50',
    status: 'pending'
  },
  {
    id: 'order-003',
    serviceName: '全程陪诊',
    hospital: '九江市中医院',
    department: '中医内科',
    appointmentAt: '2025-12-18 09:30:00',
    patient: '李女士',
    phone: '13800000003',
    visitContent: '门诊就诊',
    orderedAt: '2025-12-16 14:30:00',
    orderNo: '176586660000011003',
    serviceNeed: '全程陪同就诊及检查',
    earnings: '59.00',
    status: 'serving'
  },
  {
    id: 'order-004',
    serviceName: '代取报告',
    hospital: '九江市妇幼保健院',
    department: '检验科',
    appointmentAt: '2025-11-28 14:00:00',
    patient: '王先生',
    phone: '13800000004',
    visitContent: '代取检查报告',
    orderedAt: '2025-11-27 16:20:00',
    orderNo: '176423160000011004',
    serviceNeed: '代取报告并交付',
    earnings: '18.00',
    status: 'completed'
  },
  {
    id: 'order-005',
    serviceName: '半天院内陪诊',
    hospital: '九江市第二人民医院',
    department: '内科',
    appointmentAt: '2025-11-20 10:00:00',
    patient: '陈女士',
    phone: '13800000005',
    visitContent: '门诊陪同',
    orderedAt: '2025-11-18 11:00:00',
    orderNo: '176343480000011005',
    paidAt: '2025-11-18 11:02:00',
    acceptedAt: '2025-11-18 11:05:00',
    cancelledAt: '2025-11-19 10:00:00',
    cancelledBy: '用户',
    serviceNeed: '陪同就诊及取药',
    earnings: '35.00',
    status: 'cancelled'
  }
]
