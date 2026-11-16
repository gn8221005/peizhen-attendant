import { computed, shallowRef } from 'vue'
import { dispatchOrders, orderRecords, type OrderRecord, type OrderStatus } from '@/data/prototypeOrders'
import { useDisputeRecords } from '@/composables/useDisputeRecords'
import type { DisputeRecord } from '@/data/prototypeDisputes'

const disputeStatus: Record<string, OrderStatus | undefined> = {
  '待服务': 'pending',
  '服务中': 'serving',
  '已完成': 'completed',
  '已取消': 'cancelled'
}

const CANCELLATION_STORAGE_KEY = 'prototype-order-cancellations-v1'

interface Cancellation {
  id: string
  cancelledAt: string
  cancelledBy: '陪诊师'
  cancelledReason: string
}

interface CancelOrderInput {
  orderId?: string
  dispatchId?: string
  reason: string
  cancelledAt: string
}

const cancellations = shallowRef<Cancellation[]>([])

// An unreadable or invalid value must not be overwritten by a new cancellation.
function readCancellations(): Cancellation[] | undefined {
  if (typeof uni === 'undefined') return undefined
  try {
    const stored = uni.getStorageSync(CANCELLATION_STORAGE_KEY)
    if (stored === '' || stored === null || stored === undefined) return []
    const parsed: unknown = typeof stored === 'string' ? JSON.parse(stored) : stored
    if (!Array.isArray(parsed)) return undefined
    const seen = new Set<string>()
    if (!parsed.every((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return false
      const value = item as Record<string, unknown>
      if (typeof value.id !== 'string' || !value.id || seen.has(value.id) ||
        typeof value.cancelledAt !== 'string' || !value.cancelledAt ||
        value.cancelledBy !== '陪诊师' || typeof value.cancelledReason !== 'string' || !value.cancelledReason.trim()) return false
      seen.add(value.id)
      return true
    })) return undefined
    return parsed as Cancellation[]
  } catch {
    return undefined
  }
}

function refreshCancellations() {
  const stored = readCancellations()
  if (stored) cancellations.value = stored
}

function cancelOrder(input: CancelOrderInput): string | undefined {
  const { orderId, dispatchId, cancelledAt } = input
  const reason = input.reason.trim()
  if (Boolean(orderId) === Boolean(dispatchId) || !reason || !cancelledAt.trim()) return undefined
  // Dispatch cancellations are allowed only after the caller has confirmed acceptance.
  const order = orderId ? orderRecords.find((item) => item.id === orderId && item.status === 'pending') : undefined
  const dispatch = dispatchId ? dispatchOrders.find((item) => item.id === dispatchId) : undefined
  if (!order && !dispatch) return undefined
  const id = order?.id || dispatch!.id
  const stored = readCancellations()
  if (!stored || stored.some((item) => item.id === id)) return undefined
  const next: Cancellation[] = [...stored, { id, cancelledAt, cancelledBy: '陪诊师', cancelledReason: reason }]
  try {
    uni.setStorageSync(CANCELLATION_STORAGE_KEY, JSON.stringify(next))
    cancellations.value = next
    return id
  } catch {
    return undefined
  }
}

export function disputeOrderId(orderNo: string) {
  return `dispute-order-${orderNo}`
}

export function useOrderRecords() {
  const { disputes, refresh: refreshDisputes } = useDisputeRecords()
  function refresh() {
    refreshDisputes()
    refreshCancellations()
  }
  refreshCancellations()
  const resolved = computed(() => {
    const grouped = new Map<string, DisputeRecord[]>()
    for (const dispute of disputes.value) {
      if (!dispute.orderNo) continue
      const id = disputeOrderId(dispute.orderNo)
      const group = grouped.get(id) || []
      group.push(dispute)
      grouped.set(id, group)
    }
    const byId = new Map(cancellations.value.map((item) => [item.id, item]))
    const orders: OrderRecord[] = orderRecords.map((order) => {
      const cancellation = byId.get(order.id)
      return cancellation && order.status === 'pending' ? { ...order, ...cancellation, status: 'cancelled' } : order
    })
    for (const dispatch of dispatchOrders) {
      const cancellation = byId.get(dispatch.id)
      if (!cancellation) continue
      orders.push({
        ...dispatch,
        visitContent: dispatch.serviceNeed,
        ...cancellation,
        status: 'cancelled'
      })
    }
    const ambiguousIds = new Set<string>()
    for (const [id, group] of grouped) {
      const first = group[0].order
      const status = disputeStatus[first.status]
      const consistent = group.every(({ order: item }) =>
        item.serviceName === first.serviceName && item.hospital === first.hospital &&
        item.appointmentAt === first.appointmentAt && item.patient === first.patient && item.status === first.status
      )
      if (consistent && status) orders.push({ ...first, id, orderNo: group[0].orderNo, source: 'dispute', status })
      else ambiguousIds.add(id)
    }
    return { orders, ambiguousIds }
  })
  const orders = computed(() => resolved.value.orders)
  function findOrder(id: string) {
    return resolved.value.orders.find((order) => order.id === id)
  }
  function isAmbiguous(id: string) {
    return resolved.value.ambiguousIds.has(id)
  }
  return { orders, findOrder, isAmbiguous, refresh, cancelOrder }
}
