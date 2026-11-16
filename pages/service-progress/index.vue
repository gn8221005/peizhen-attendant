<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppNavigationBar from '@/components/AppNavigationBar.vue'
import ServiceProgressCard from '@/components/ServiceProgressCard.vue'
import { useOrderRecords } from '@/composables/useOrderRecords'

type ServiceStage = 'waiting' | 'pending' | 'serving' | 'completed' | 'cancelled'

const stage = shallowRef<ServiceStage>('serving')
const orderId = shallowRef('')
const orderMode = shallowRef(false)
const { findOrder } = useOrderRecords()
const order = computed(() => orderMode.value ? findOrder(orderId.value) : undefined)

onLoad((options) => {
  orderMode.value = options?.orderId !== undefined
  orderId.value = typeof options?.orderId === 'string' ? options.orderId : ''
  const requestedStage = options?.status
  if (requestedStage && ['waiting', 'pending', 'serving', 'completed', 'cancelled'].includes(requestedStage)) {
    stage.value = requestedStage as ServiceStage
  } else if (order.value) {
    stage.value = order.value.status
  }
})
</script>

<template>
  <view class="service-progress-page">
    <AppNavigationBar title="服务进度" :show-back="true" />
    <scroll-view v-if="!orderMode || (order && order.source !== 'dispute')" class="service-progress-page__scroll" scroll-y>
      <view class="service-progress-page__content">
        <ServiceProgressCard :stage="stage" :paid-at="stage === 'cancelled' && order ? order.paidAt || '未提供' : undefined" :accepted-at="stage === 'cancelled' && order ? order.acceptedAt || '未提供' : undefined" :cancelled-at="stage === 'cancelled' && order ? order.cancelledAt || '未提供' : undefined" />
      </view>
    </scroll-view>
    <view v-else class="service-progress-page__empty">未找到可查看的服务进度</view>
  </view>
</template>

<style scoped>
.service-progress-page { display: flex; flex-direction: column; box-sizing: border-box; height: 100vh; min-height: 0; overflow: hidden; background: linear-gradient(180deg, #edf8ff 0%, #f7fbff 100%); }
.service-progress-page__scroll { flex: 1; min-height: 0; width: 100%; }
.service-progress-page__content { padding: 24rpx; }
.service-progress-page__empty { display: flex; flex: 1; align-items: center; justify-content: center; color: #8794a9; font-size: 28rpx; }
</style>
