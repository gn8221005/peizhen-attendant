<script setup lang="ts">
import { computed } from 'vue'

type ServiceStage = 'waiting' | 'pending' | 'serving' | 'completed' | 'cancelled'

const props = defineProps<{ stage: ServiceStage; paidAt?: string; acceptedAt?: string; cancelledAt?: string }>()

const serviceTimeline = [
  { title: '订单已支付', time: '2026-08-24 09:12', icon: '/static/images/timeline-paid.png' },
  { title: '已接单', time: '2026-08-24 09:15', icon: '/static/images/timeline-accepted.png' },
  { title: '服务中', time: '2026-08-24 09:28', icon: '/static/images/timeline-serving.png' },
  { title: '服务完成', time: '2026-08-24 10:10', icon: '/static/images/timeline-completed.png' }
]
const timeline = computed(() => props.stage === 'cancelled' ? [
  { ...serviceTimeline[0], time: props.paidAt || serviceTimeline[0].time },
  { ...serviceTimeline[1], time: props.acceptedAt || serviceTimeline[1].time },
  { title: '已取消', time: props.cancelledAt || '2026-08-24 09:20', icon: '/static/images/timeline-cancelled.png' }
] : serviceTimeline)
const activeIndexes: Record<ServiceStage, number> = { waiting: 0, pending: 1, serving: 2, completed: 3, cancelled: 2 }
const activeIndex = computed(() => activeIndexes[props.stage])
</script>

<template>
  <view class="service-progress-card">
    <view class="service-progress-card__heading">
      <image class="service-progress-card__heading-icon" src="/static/images/timeline-heading.png" mode="aspectFit" aria-hidden="true" />
      <text class="service-progress-card__title">服务进度</text>
    </view>

    <view class="service-progress-card__timeline" role="list" aria-label="服务进度时间线">
      <view
        v-for="(event, index) in timeline"
        :key="event.title"
        :class="['service-progress-card__event', index === activeIndex ? 'service-progress-card__event--active' : index < activeIndex ? 'service-progress-card__event--done' : 'service-progress-card__event--pending']"
        role="listitem"
      >
        <view class="service-progress-card__rail" aria-hidden="true">
          <view class="service-progress-card__marker">
            <image class="service-progress-card__icon" :src="event.icon" mode="aspectFit" />
          </view>
          <view v-if="index < timeline.length - 1" :class="['service-progress-card__line', { 'service-progress-card__line--done': index < activeIndex }]" />
        </view>
        <view class="service-progress-card__event-content">
          <text class="service-progress-card__event-title">{{ event.title }}</text>
          <text v-if="event.time && event.time !== '未提供'" class="service-progress-card__event-time">{{ event.time }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.service-progress-card { box-sizing: border-box; width: 100%; padding: 40rpx 28rpx 48rpx; border: 1rpx solid #e8eff5; border-radius: 28rpx; background: #fff; box-shadow: 0 10rpx 28rpx rgba(47, 119, 162, 0.06); }
.service-progress-card__heading { display: flex; align-items: center; padding: 0 12rpx 46rpx; }
.service-progress-card__heading-icon { display: block; width: 56rpx; height: 56rpx; }
.service-progress-card__title { margin-left: 16rpx; color: #151c29; font-size: 42rpx; font-weight: 700; line-height: 58rpx; }
.service-progress-card__event { display: flex; min-height: 164rpx; }
.service-progress-card__event:last-child { min-height: 0; }
.service-progress-card__rail { position: relative; display: flex; flex: 0 0 100rpx; justify-content: center; }
.service-progress-card__marker { position: relative; z-index: 1; display: flex; flex-shrink: 0; align-items: center; justify-content: center; box-sizing: border-box; width: 72rpx; height: 72rpx; border: 3rpx solid #3679fb; border-radius: 50%; background: #fff; color: #3679fb; }
.service-progress-card__icon { display: block; width: 46rpx; height: 46rpx; }
.service-progress-card__line { position: absolute; top: 72rpx; bottom: 0; left: 50%; width: 0; border-left: 3rpx dashed #c8cbd0; transform: translateX(-50%); }
.service-progress-card__line--done { border-left-style: solid; border-left-color: #3679fb; }
.service-progress-card__event-content { box-sizing: border-box; flex: 1; min-width: 0; margin: 0 0 0 20rpx; padding: 2rpx 8rpx 28rpx; }
.service-progress-card__event-title { display: block; color: #161d29; font-size: 36rpx; font-weight: 700; line-height: 50rpx; }
.service-progress-card__event-time { display: block; margin-top: 10rpx; color: #7b8495; font-size: 30rpx; line-height: 44rpx; }
.service-progress-card__event--pending .service-progress-card__marker { border-color: #c6c9cd; color: #999; }
.service-progress-card__event--pending .service-progress-card__icon { filter: grayscale(1); opacity: 0.6; }
.service-progress-card__event--active .service-progress-card__marker { background: #3675ed; border-color: #3675ed; }
.service-progress-card__event--active .service-progress-card__icon { filter: brightness(0) invert(1); }
.service-progress-card__event--active .service-progress-card__event-title { color: #3675ed; }
</style>
