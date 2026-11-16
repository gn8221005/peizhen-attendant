<script setup lang="ts">
import type { DispatchOrder } from '@/data/prototypeOrders'

interface Props {
  order: DispatchOrder
}

const props = defineProps<Props>()

const emit = defineEmits<{
  open: []
  dismiss: []
}>()

const serviceArt = props.order.serviceName.includes('报告')
  ? '/static/images/dispatch-report.png'
  : props.order.serviceName.includes('全程')
    ? '/static/images/dispatch-accompaniment.png'
    : '/static/images/dispatch-half-day.png'
</script>

<template>
  <view class="dispatch-card" role="button" :aria-label="`查看${props.order.serviceName}派单`" @tap="emit('open')">
    <image class="dispatch-card__service-art" :src="serviceArt" mode="aspectFit" aria-hidden="true" />

    <view class="dispatch-card__main">
      <view class="dispatch-card__heading">
        <text class="dispatch-card__service">{{ props.order.serviceName }}</text>
        <view class="dispatch-card__distance">
          <view class="dispatch-card__pin" aria-hidden="true" />
          <text>{{ props.order.distance }}</text>
        </view>
      </view>

      <view class="dispatch-card__rows">
        <view class="dispatch-card__row">
          <text class="dispatch-card__label">医院名称</text>
          <text class="dispatch-card__value">{{ props.order.hospital }}</text>
        </view>
        <view class="dispatch-card__row">
          <text class="dispatch-card__label">就诊科室</text>
          <text class="dispatch-card__value">{{ props.order.department }}</text>
        </view>
        <view class="dispatch-card__row">
          <text class="dispatch-card__label">预约时间</text>
          <text class="dispatch-card__value">{{ props.order.appointmentAt }}</text>
        </view>
        <view class="dispatch-card__row">
          <text class="dispatch-card__label">就诊人员</text>
          <text class="dispatch-card__value">{{ props.order.patient }}</text>
        </view>
        <view class="dispatch-card__row">
          <text class="dispatch-card__label">联系电话</text>
          <text class="dispatch-card__value">{{ props.order.phone }}</text>
        </view>
        <view class="dispatch-card__row">
          <text class="dispatch-card__label">服务需求</text>
          <text class="dispatch-card__value">{{ props.order.serviceNeed }}</text>
        </view>
      </view>

      <view class="dispatch-card__actions">
        <view class="dispatch-card__income">
          <text class="dispatch-card__income-label">本单收益</text>
          <text class="dispatch-card__income-value">¥{{ props.order.earnings }}</text>
        </view>
        <view class="dispatch-card__buttons">
          <view class="dispatch-card__dismiss" role="button" aria-label="不感兴趣" @tap.stop="emit('dismiss')">
            <text>不感兴趣</text>
          </view>
          <view class="dispatch-card__accept" role="button" aria-label="接单" @tap.stop="emit('open')">
            <text>接单</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.dispatch-card {
  display: flex;
  align-items: flex-start;
  box-sizing: border-box;
  width: 100%;
  padding: 26rpx 22rpx;
  border: 1rpx solid #e8eef8;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 10rpx 28rpx rgba(55, 104, 166, 0.08);
}

.dispatch-card__service-art {
  display: block;
  flex: 0 0 112rpx;
  height: 112rpx;
  margin: 4rpx 20rpx 0 0;
}

.dispatch-card__main {
  flex: 1;
  min-width: 0;
}

.dispatch-card__heading,
.dispatch-card__distance,
.dispatch-card__row,
.dispatch-card__actions,
.dispatch-card__income,
.dispatch-card__buttons {
  display: flex;
  align-items: center;
}

.dispatch-card__heading {
  justify-content: space-between;
  gap: 12rpx;
  margin-bottom: 10rpx;
}

.dispatch-card__service {
  min-width: 0;
  color: #172033;
  font-size: 36rpx;
  font-weight: 700;
  line-height: 48rpx;
}

.dispatch-card__distance {
  flex: 0 0 auto;
  color: #3478e8;
  font-size: 28rpx;
  line-height: 40rpx;
}

.dispatch-card__pin {
  position: relative;
  width: 22rpx;
  height: 22rpx;
  margin-right: 8rpx;
  border-radius: 50% 50% 50% 0;
  background: #3478e8;
  transform: rotate(-45deg);
}

.dispatch-card__pin::after {
  position: absolute;
  top: 7rpx;
  left: 7rpx;
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  content: '';
  background: #ffffff;
}

.dispatch-card__rows {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.dispatch-card__row {
  align-items: flex-start;
  color: #202a3b;
  font-size: 30rpx;
  line-height: 42rpx;
}

.dispatch-card__label {
  flex: 0 0 auto;
  color: #637087;
}

.dispatch-card__value {
  flex: 1;
  min-width: 0;
  margin-left: 8rpx;
  font-size: 34rpx;
  line-height: 44rpx;
  overflow-wrap: anywhere;
  word-break: break-all;
}

.dispatch-card__actions {
  justify-content: space-between;
  gap: 12rpx;
  margin-top: 18rpx;
}

.dispatch-card__income {
  flex-wrap: wrap;
  gap: 6rpx;
}

.dispatch-card__income-label {
  color: #182235;
  font-size: 30rpx;
  line-height: 42rpx;
}

.dispatch-card__income-value {
  color: #2475f5;
  font-size: 36rpx;
  font-weight: 700;
  line-height: 48rpx;
  white-space: nowrap;
}

.dispatch-card__buttons {
  flex: 0 0 auto;
  gap: 12rpx;
}

.dispatch-card__dismiss,
.dispatch-card__accept {
  display: flex;
  min-height: 72rpx;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 22rpx;
  border-radius: 999rpx;
  font-size: 28rpx;
  line-height: 40rpx;
}

.dispatch-card__dismiss {
  color: #52719d;
  text-decoration: underline;
}

.dispatch-card__accept {
  min-width: 132rpx;
  color: #ffffff;
  background: linear-gradient(100deg, #2c83ff, #1766e9);
}

@media screen and (max-width: 360px) {
  .dispatch-card {
    padding-right: 16rpx;
    padding-left: 16rpx;
  }

  .dispatch-card__service-art {
    flex-basis: 92rpx;
    width: 92rpx;
    height: 92rpx;
    margin-right: 14rpx;
  }

  .dispatch-card__buttons {
    gap: 4rpx;
  }

  .dispatch-card__dismiss,
  .dispatch-card__accept {
    padding-right: 14rpx;
    padding-left: 14rpx;
    font-size: 26rpx;
  }
}
</style>
