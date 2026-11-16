<script setup lang="ts">
import AppNavigationBar from '@/components/AppNavigationBar.vue'
import { computed, shallowRef } from 'vue'
import dayjs from 'dayjs'
import { onLoad, onShow } from '@dcloudio/uni-app'
import AppActionBar from '@/components/AppActionBar.vue'
import ServiceDetailsPanel from '@/components/ServiceDetailsPanel.vue'
import CancelOrderDialog from '@/components/CancelOrderDialog.vue'
import { useOrderRecords } from '@/composables/useOrderRecords'
import { dispatchOrders } from '@/data/prototypeOrders'

type ServiceStage = 'waiting' | 'pending' | 'serving' | 'completed' | 'cancelled'
type FooterActionKey = 'decline' | 'primary'

const stage = shallowRef<ServiceStage>('waiting')
const lastOrderStatus = shallowRef<ServiceStage | undefined>(undefined)
const orderId = shallowRef('')
const orderMode = shallowRef(false)
const dispatchId = shallowRef('')
const dispatchMode = shallowRef(false)
const dispatchAccepted = shallowRef(false)
const showCancelDialog = shallowRef(false)
const previewCancellation = shallowRef<{ cancelledAt: string; cancelledBy: string; cancelledReason: string } | undefined>(undefined)
const { findOrder, isAmbiguous, refresh, cancelOrder } = useOrderRecords()
const order = computed(() => orderMode.value ? findOrder(orderId.value) : undefined)
const dispatch = computed(() => dispatchMode.value ? dispatchOrders.find((item) => item.id === dispatchId.value) : undefined)
const hasDetails = computed(() => (!orderMode.value || Boolean(order.value)) && (!dispatchMode.value || Boolean(dispatch.value)))

const footerActions = computed(() => {
  if (stage.value === 'waiting') {
    return [
      { key: 'decline', label: '不感兴趣', tone: 'secondary' as const },
      { key: 'primary', label: '确认接单', tone: 'blue' as const }
    ]
  }

  if (stage.value === 'pending') {
    return [
      { key: 'decline', label: '取消订单', tone: 'secondary' as const },
      { key: 'primary', label: '服务开始', tone: 'green' as const }
    ]
  }

  if (stage.value === 'serving') {
    return [{ key: 'primary', label: '服务完成', tone: 'green' as const }]
  }

  return []
})

const hasFooterActions = computed(() => hasDetails.value && (!orderMode.value || order.value?.source !== 'dispute') && footerActions.value.length > 0)

onLoad((options) => {
  orderMode.value = options?.orderId !== undefined
  orderId.value = typeof options?.orderId === 'string' ? options.orderId : ''
  dispatchMode.value = options?.dispatchId !== undefined
  dispatchId.value = typeof options?.dispatchId === 'string' ? options.dispatchId : ''
  if (!orderMode.value && dispatchMode.value && findOrder(dispatchId.value)?.status === 'cancelled') {
    orderId.value = dispatchId.value
    orderMode.value = true
    dispatchMode.value = false
  }
  if (orderMode.value) {
    if (order.value) {
      stage.value = order.value.status
      lastOrderStatus.value = order.value.status
    }
    return
  }
  const requestedStage = options?.status
  if (requestedStage && ['waiting', 'pending', 'serving', 'completed', 'cancelled'].includes(requestedStage)) {
    stage.value = requestedStage as ServiceStage
  }
})

onShow(() => {
  if (!orderMode.value) return
  refresh()
  if (order.value && order.value.status !== lastOrderStatus.value) {
    stage.value = order.value.status
    lastOrderStatus.value = order.value.status
  }
})

function setStage(nextStage: ServiceStage) {
  if (order.value?.source === 'dispute') return
  stage.value = nextStage
}

function handlePrimaryAction() {
  if (stage.value === 'waiting') {
    if (dispatchMode.value) dispatchAccepted.value = true
    setStage('pending')
    uni.showToast({ title: '接单成功', icon: 'success' })
    return
  }
  if (stage.value === 'pending') {
    setStage('serving')
    uni.showToast({ title: '服务已开始', icon: 'success' })
    return
  }
  if (stage.value === 'serving') {
    setStage('completed')
    uni.showToast({ title: '服务已完成', icon: 'success' })
  }
}

function declineOrder() {
  uni.navigateBack({
    delta: 1,
    fail: () => uni.reLaunch({ url: '/pages/orders/index' })
  })
}

function handleFooterAction(key: string) {
  if ((key as FooterActionKey) === 'decline') {
    if (stage.value === 'pending') {
      if ((orderMode.value && order.value?.status !== 'pending') || (dispatchMode.value && !dispatchAccepted.value)) {
        uni.showToast({ title: '当前订单无法取消', icon: 'none' })
        return
      }
      showCancelDialog.value = true
    } else {
      declineOrder()
    }
    return
  }

  handlePrimaryAction()
}

function confirmCancellation(reason: string) {
  if (stage.value !== 'pending' || !reason.trim()) return
  const cancelledAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
  if (orderMode.value || dispatchMode.value) {
    const cancelledOrderId = cancelOrder({
      orderId: orderMode.value ? orderId.value : undefined,
      dispatchId: dispatchMode.value && dispatchAccepted.value ? dispatchId.value : undefined,
      reason: reason.trim(),
      cancelledAt
    })
    if (!cancelledOrderId) {
      uni.showToast({ title: '取消失败，请重试', icon: 'none' })
      return
    }
    orderId.value = cancelledOrderId
    orderMode.value = true
    dispatchMode.value = false
    lastOrderStatus.value = 'cancelled'
  } else {
    previewCancellation.value = { cancelledAt, cancelledBy: '陪诊师', cancelledReason: reason.trim() }
  }
  stage.value = 'cancelled'
  showCancelDialog.value = false
  uni.showToast({ title: '订单已取消', icon: 'success' })
}
</script>

<template>
  <view class="service-page" :class="{ 'service-page--with-footer': hasFooterActions }">
    <AppNavigationBar title="服务详情" :show-back="true" />

    <scroll-view v-if="hasDetails" class="service-page__scroll" scroll-y>
      <ServiceDetailsPanel
        :stage="stage"
        :order="order"
        :dispatch="dispatch"
        :cancellation="previewCancellation"
        @stage-change="setStage"
      />
    </scroll-view>

    <view v-else class="service-page__empty">{{ isAmbiguous(orderId) ? '订单记录存在冲突，暂时无法查看' : '未找到这笔订单' }}</view>

    <AppActionBar
      v-if="hasFooterActions"
      :actions="footerActions"
      @action="handleFooterAction"
    />
    <CancelOrderDialog :visible="showCancelDialog" @close="showCancelDialog = false" @confirm="confirmCancellation" />
  </view>
</template>

<style scoped>
.service-page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100vh;
  min-height: 0;

  overflow: hidden;
  background: linear-gradient(180deg, #eaf8ff 0%, #f7fbff 42%, #eef8fc 100%);
}

.service-page--with-footer {
  padding-bottom: calc(154rpx + env(safe-area-inset-bottom));
}

.service-page__scroll {
  flex: 1;
  min-height: 0;
  width: 100%;
}

.service-page__empty { display: flex; flex: 1; align-items: center; justify-content: center; color: #8794a9; font-size: 28rpx; }
</style>
