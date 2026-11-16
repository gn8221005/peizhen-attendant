<script setup lang="ts">
import type { OrderRecord } from '@/data/prototypeOrders'

interface Props {
  order: OrderRecord
}

const props = defineProps<Props>()

const emit = defineEmits<{
  open: [status: OrderRecord['status']]
}>()

const statusLabels: Record<OrderRecord['status'], string> = {
  pending: '待服务',
  serving: '服务中',
  completed: '已完成',
  cancelled: '已取消'
}

const durationArt: Record<OrderRecord['status'], string> = {
  pending: '/static/images/order-duration-pending.png',
  serving: '/static/images/order-duration-serving.png',
  completed: '/static/images/order-duration-completed.png',
  cancelled: '/static/images/order-duration-cancelled.png'
}

const durationLabel = props.order.serviceName.includes('全天') || props.order.serviceName.includes('全程') ? '24' : '12'
</script>

<template>
  <view
    class="order-record-card"
    :class="`order-record-card--${props.order.status}`"
    role="button"
    :aria-label="`查看${statusLabels[props.order.status]}订单：${props.order.serviceName}`"
    @tap="emit('open', props.order.status)"
  >
    <view class="order-record-card__duration" aria-hidden="true">
      <image class="order-record-card__duration-art" :src="durationArt[props.order.status]" mode="aspectFit" />
      <text v-if="props.order.source !== 'dispute'">{{ durationLabel }}</text>
    </view>

    <view class="order-record-card__content">
      <view class="order-record-card__heading">
        <text class="order-record-card__service">{{ props.order.serviceName }}</text>
        <text class="order-record-card__status">{{ statusLabels[props.order.status] }}</text>
      </view>
      <text class="order-record-card__hospital">{{ props.order.hospital }}</text>
      <text class="order-record-card__detail">预约时间：{{ props.order.appointmentAt }}</text>
      <text class="order-record-card__detail">就诊人：{{ props.order.patient }}</text>
    </view>

    <text v-if="props.order.status !== 'cancelled' && props.order.earnings !== undefined" class="order-record-card__earnings">订单收益 {{ props.order.earnings }}</text>
  </view>
</template>

<style scoped>
.order-record-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  box-sizing: border-box;
  width: 100%;
  min-height: 252rpx;
  padding: 24rpx 24rpx 28rpx;
  border: 1rpx solid #edf0f5;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(35, 50, 70, 0.06);
}

.order-record-card__duration {
  display: flex;
  flex: 0 0 108rpx;
  height: 108rpx;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 12rpx 24rpx 0 0;
  color: #6e98e8;
  font-size: 32rpx;
  line-height: 36rpx;
}

.order-record-card__duration-art {
  display: block;
  width: 76rpx;
  height: 76rpx;
}

.order-record-card__content {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 8rpx;
  padding-right: 8rpx;
}

.order-record-card__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10rpx;
}

.order-record-card__service {
  flex: 1;
  min-width: 0;
  color: #141b28;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 44rpx;
}

.order-record-card__status {
  flex: 0 0 auto;
  padding: 3rpx 12rpx;
  border-radius: 8rpx;
  color: #ffffff;
  background: #35b477;
  font-size: 25rpx;
  line-height: 36rpx;
}

.order-record-card--serving .order-record-card__status {
  background: #8d65dd;
}

.order-record-card--completed .order-record-card__status {
  background: #efa047;
}

.order-record-card--cancelled .order-record-card__status {
  background: #e96868;
}

.order-record-card__hospital,
.order-record-card__detail {
  color: #202938;
  font-size: 30rpx;
  line-height: 42rpx;
  overflow-wrap: anywhere;
  word-break: break-all;
}

.order-record-card__earnings {
  position: absolute;
  right: 24rpx;
  bottom: 22rpx;
  max-width: 45%;
  color: #5e86e8;
  font-size: 28rpx;
  line-height: 38rpx;
  text-align: right;
}

@media screen and (max-width: 360px) {
  .order-record-card {
    padding-right: 18rpx;
    padding-left: 18rpx;
  }

  .order-record-card__duration {
    flex-basis: 88rpx;
    width: 88rpx;
    height: 88rpx;
    margin-right: 16rpx;
  }

  .order-record-card__earnings {
    right: 18rpx;
    font-size: 25rpx;
  }
}
</style>
