<script setup lang="ts">
import type { DisputeOrderSnapshot } from '@/data/prototypeDisputes'

const props = defineProps<{ order: DisputeOrderSnapshot; orderNo: string }>()
const emit = defineEmits<{ open: [orderNo: string] }>()
</script>

<template>
	<view
		class="dispute-order-card"
		role="button"
		:aria-label="`查看订单详情，${props.order.serviceName}，订单编号 ${props.orderNo}`"
		hover-class="dispute-order-card--pressed"
		hover-stay-time="70"
		@tap="emit('open', props.orderNo)"
	>
		<view class="dispute-order-card__clock" aria-hidden="true">
			<view class="dispute-order-card__clock-face"><view /></view>
			<text>12</text>
		</view>
		<view class="dispute-order-card__content">
			<view class="dispute-order-card__heading">
				<text class="dispute-order-card__name">{{ order.serviceName }}</text>
				<text class="dispute-order-card__status">{{ order.status }}</text>
			</view>
			<text class="dispute-order-card__value">{{ order.hospital }}</text>
			<text class="dispute-order-card__value">预约时间：{{ order.appointmentAt }}</text>
			<text class="dispute-order-card__value">就诊人：{{ order.patient }}</text>
		</view>
		<view class="dispute-order-card__chevron" aria-hidden="true" />
	</view>
</template>

<style scoped>
.dispute-order-card {
	display: flex;
	box-sizing: border-box;
	align-items: center;
	gap: 22rpx;
	margin: 20rpx 24rpx;
	padding: 22rpx 26rpx;
	border: 1rpx solid #edf0f5;
	border-radius: 24rpx;
	background: #ffffff;
	box-shadow: 0 8rpx 24rpx rgba(45, 80, 130, 0.05);
	transition: opacity 0.16s ease;
}

.dispute-order-card--pressed { opacity: 0.72; }

.dispute-order-card__clock {
	display: flex;
	position: relative;
	flex: 0 0 116rpx;
	width: 116rpx;
	height: 116rpx;
	align-items: center;
	justify-content: flex-start;
	color: #fb8b24;
}

.dispute-order-card__clock-face {
	position: relative;
	box-sizing: border-box;
	width: 94rpx;
	height: 94rpx;
	border: 7rpx solid currentColor;
	border-radius: 50%;
}

.dispute-order-card__clock-face::before,
.dispute-order-card__clock-face::after,
.dispute-order-card__clock-face > view {
	position: absolute;
	content: '';
	border-radius: 999rpx;
	background: currentColor;
}

.dispute-order-card__clock-face::before {
	left: 39rpx;
	top: 16rpx;
	width: 6rpx;
	height: 34rpx;
}

.dispute-order-card__clock-face::after {
	left: 19rpx;
	top: 47rpx;
	width: 31rpx;
	height: 6rpx;
	transform: rotate(-38deg);
	transform-origin: right center;
}

.dispute-order-card__clock > text {
	position: absolute;
	right: 0;
	bottom: -3rpx;
	color: currentColor;
	font-size: 42rpx;
	font-weight: 700;
	line-height: 48rpx;
}

.dispute-order-card__content {
	flex: 1;
	min-width: 0;
}

.dispute-order-card__heading {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 12rpx;
	margin-bottom: 8rpx;
}

.dispute-order-card__name {
	min-width: 0;
	color: #17243a;
	font-size: 31rpx;
	font-weight: 700;
	line-height: 44rpx;
	word-break: break-all;
}

.dispute-order-card__status {
	flex: 0 0 auto;
	color: #7b8aa2;
	font-size: 25rpx;
	line-height: 38rpx;
}

.dispute-order-card__value {
	display: block;
	margin-top: 4rpx;
	color: #3a4962;
	font-size: 27rpx;
	line-height: 40rpx;
	word-break: break-all;
}

.dispute-order-card__chevron {
	box-sizing: border-box;
	width: 19rpx;
	height: 19rpx;
	flex: 0 0 19rpx;
	margin-left: 4rpx;
	border-top: 4rpx solid #8290a4;
	border-right: 4rpx solid #8290a4;
	transform: rotate(45deg);
}

@media screen and (max-width: 360px) {
	.dispute-order-card { gap: 14rpx; margin-right: 16rpx; margin-left: 16rpx; padding-right: 18rpx; padding-left: 18rpx; }
	.dispute-order-card__clock { flex-basis: 92rpx; width: 92rpx; height: 100rpx; }
	.dispute-order-card__clock-face { width: 76rpx; height: 76rpx; }
	.dispute-order-card__clock-face::before { left: 31rpx; top: 11rpx; height: 29rpx; }
	.dispute-order-card__clock-face::after { left: 13rpx; top: 38rpx; width: 26rpx; }
	.dispute-order-card__name { font-size: 28rpx; }
	.dispute-order-card__value { font-size: 24rpx; }
}
</style>
