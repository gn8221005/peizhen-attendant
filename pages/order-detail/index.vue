<script setup lang="ts">
import AppNavigationBar from '@/components/AppNavigationBar.vue'
import { computed, shallowRef } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useDisputeRecords } from '@/composables/useDisputeRecords'

const { disputes, refresh } = useDisputeRecords()
const orderNo = shallowRef('')
const disputeId = shallowRef('')
const lookupByDisputeId = shallowRef(false)
const matchingOrders = computed(() => orderNo.value
	? disputes.value.filter((item) => item.orderNo === orderNo.value)
	: [])
const record = computed(() => lookupByDisputeId.value
	? disputes.value.find((item) => item.id === disputeId.value)
	: matchingOrders.value.length === 1 ? matchingOrders.value[0] : undefined)
const isAmbiguousOrderNo = computed(() => !lookupByDisputeId.value && matchingOrders.value.length > 1)
const fallbackPath = computed(() =>
	record.value
		? `/pages/dispute-detail/index?id=${encodeURIComponent(record.value.id)}`
		: '/pages/disputes/index'
)

onLoad((options) => {
	lookupByDisputeId.value = options?.disputeId !== undefined
	disputeId.value = typeof options?.disputeId === 'string' ? options.disputeId : ''
	orderNo.value = typeof options?.orderNo === 'string' ? options.orderNo : ''
})

onShow(refresh)
</script>

<template>
	<view class="order-detail-page">
	  <AppNavigationBar title="订单详情" :show-back="true" />

		<scroll-view v-if="record" class="order-detail-page__scroll" scroll-y>
			<view class="order-detail-hero">
				<text class="order-detail-hero__eyebrow">争议记录中的订单信息</text>
				<text class="order-detail-hero__name">{{ record.order.serviceName }}</text>
				<text class="order-detail-hero__status">记录时状态：{{ record.order.status || '暂无状态' }}</text>
			</view>

			<view class="order-detail-card">
				<text class="order-detail-card__title">预约信息</text>
				<view class="order-detail-row">
					<text class="order-detail-row__label">订单编号</text>
					<text class="order-detail-row__value">{{ record.orderNo }}</text>
				</view>
				<view class="order-detail-row">
					<text class="order-detail-row__label">服务项目</text>
					<text class="order-detail-row__value">{{ record.order.serviceName }}</text>
				</view>
				<view class="order-detail-row">
					<text class="order-detail-row__label">医院名称</text>
					<text class="order-detail-row__value">{{ record.order.hospital }}</text>
				</view>
				<view class="order-detail-row">
					<text class="order-detail-row__label">预约时间</text>
					<text class="order-detail-row__value">{{ record.order.appointmentAt }}</text>
				</view>
				<view class="order-detail-row">
					<text class="order-detail-row__label">就诊人</text>
					<text class="order-detail-row__value">{{ record.order.patient }}</text>
				</view>
			</view>
		</scroll-view>

		<view v-else class="order-detail-empty">
			<text>{{ isAmbiguousOrderNo ? '该订单号关联多条争议记录，请从对应争议详情进入' : '未找到这笔订单' }}</text>
		</view>
	</view>
</template>

<style scoped>
.order-detail-page { display: flex; box-sizing: border-box; height: 100vh; height: 100dvh; min-height: 0; flex-direction: column;  overflow: hidden; background: #f3f7fc; }
.order-detail-page__scroll { flex: 1; min-height: 0; width: 100%; }
.order-detail-hero { display: flex; flex-direction: column; margin: 24rpx; padding: 30rpx; border-radius: 26rpx; color: #ffffff; background: linear-gradient(110deg, #16b7b1, #62d4cd); box-shadow: 0 10rpx 24rpx rgba(32, 155, 157, 0.14); }
.order-detail-hero__eyebrow { color: rgba(255, 255, 255, 0.88); font-size: 26rpx; line-height: 38rpx; }
.order-detail-hero__name { margin-top: 8rpx; font-size: 38rpx; font-weight: 700; line-height: 54rpx; }
.order-detail-hero__status { align-self: flex-start; margin-top: 18rpx; padding: 6rpx 18rpx; border-radius: 999rpx; color: #138779; background: rgba(255, 255, 255, 0.92); font-size: 24rpx; line-height: 34rpx; }
.order-detail-card { margin: 18rpx 24rpx; padding: 28rpx; border: 1rpx solid #edf0f5; border-radius: 24rpx; background: #ffffff; box-shadow: 0 8rpx 22rpx rgba(48, 82, 125, 0.05); }
.order-detail-card__title { display: block; margin-bottom: 16rpx; color: #17243a; font-size: 33rpx; font-weight: 700; line-height: 46rpx; }
.order-detail-row { display: flex; gap: 18rpx; padding: 15rpx 0; border-top: 1rpx solid #edf0f5; font-size: 28rpx; line-height: 42rpx; }
.order-detail-row__label { flex: 0 0 155rpx; color: #7b899f; }
.order-detail-row__value { min-width: 0; flex: 1; color: #25334b; word-break: break-all; }
.order-detail-empty { display: flex; flex: 1; align-items: center; justify-content: center; color: #8794a9; font-size: 28rpx; }

@media screen and (max-width: 360px) {
	.order-detail-hero, .order-detail-card { margin-right: 16rpx; margin-left: 16rpx; padding-right: 22rpx; padding-left: 22rpx; }
	.order-detail-row__label { flex-basis: 132rpx; }
}
</style>
