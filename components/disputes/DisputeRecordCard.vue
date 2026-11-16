<script setup lang="ts">
import type { DisputeRecord, DisputeStatus } from '@/data/prototypeDisputes'

const props = defineProps<{ record: DisputeRecord }>()
const emit = defineEmits<{ open: [id: string] }>()

const statusLabels: Record<DisputeStatus, string> = {
	'pending-response': '待回应',
	processing: '处理中',
	established: '成立',
	'not-established': '不成立'
}
</script>

<template>
	<view
		class="dispute-record-card"
		role="button"
		:aria-label="`查看${record.category}争议，状态${statusLabels[record.status]}`"
		hover-class="dispute-record-card--pressed"
		hover-stay-time="70"
		@tap="emit('open', props.record.id)"
	>
		<view class="dispute-record-card__heading">
			<text class="dispute-record-card__category">{{ record.category }}</text>
			<text
				class="dispute-record-card__status"
				:class="`dispute-record-card__status--${record.status}`"
			>
				{{ statusLabels[record.status] }}
			</text>
		</view>

		<view class="dispute-record-card__row">
			<text class="dispute-record-card__label">订单编号</text>
			<text class="dispute-record-card__value">{{ record.orderNo }}</text>
		</view>
		<view class="dispute-record-card__row">
			<text class="dispute-record-card__label">投诉时间</text>
			<text class="dispute-record-card__value">{{ record.filedAt }}</text>
		</view>
		<view class="dispute-record-card__chevron" aria-hidden="true" />
	</view>
</template>

<style scoped>
.dispute-record-card {
	position: relative;
	box-sizing: border-box;
	margin: 18rpx 24rpx;
	padding: 28rpx 76rpx 28rpx 30rpx;
	border: 1rpx solid #eef1f5;
	border-radius: 26rpx;
	background: #ffffff;
	box-shadow: 0 8rpx 24rpx rgba(38, 73, 120, 0.05);
	transition: opacity 0.16s ease;
}

.dispute-record-card--pressed { opacity: 0.7; }

.dispute-record-card__heading {
	display: flex;
	min-height: 54rpx;
	align-items: center;
	justify-content: space-between;
	gap: 16rpx;
	margin-bottom: 18rpx;
	margin-right: -48rpx;
}

.dispute-record-card__category {
	min-width: 0;
	color: #17243a;
	font-size: 34rpx;
	font-weight: 700;
	line-height: 48rpx;
	word-break: break-all;
}

.dispute-record-card__status {
	display: flex;
	flex: 0 0 auto;
	min-width: 112rpx;
	min-height: 54rpx;
	align-items: center;
	justify-content: center;
	padding: 0 20rpx;
	border-radius: 999rpx;
	font-size: 27rpx;
	font-weight: 600;
}

.dispute-record-card__status--pending-response {
	color: #e84545;
	background: #fff0f0;
}

.dispute-record-card__status--processing {
	color: #2878da;
	background: #e9f3ff;
}

.dispute-record-card__status--established {
	color: #25a967;
	background: #e9f8ef;
}

.dispute-record-card__status--not-established {
	color: #657187;
	background: #eef0f4;
}

.dispute-record-card__row {
	display: flex;
	align-items: flex-start;
	gap: 18rpx;
	margin-top: 12rpx;
	font-size: 28rpx;
	line-height: 42rpx;
}

.dispute-record-card__label {
	flex: 0 0 142rpx;
	color: #7c8aa3;
}

.dispute-record-card__value {
	min-width: 0;
	flex: 1;
	color: #4c5b73;
	word-break: break-all;
}

.dispute-record-card__chevron {
	position: absolute;
	top: 50%;
	right: 28rpx;
	box-sizing: border-box;
	width: 17rpx;
	height: 17rpx;
	border-top: 4rpx solid #8390a5;
	border-right: 4rpx solid #8390a5;
	transform: translateY(-50%) rotate(45deg);
}

@media screen and (max-width: 360px) {
	.dispute-record-card { margin-right: 16rpx; margin-left: 16rpx; padding-right: 62rpx; padding-left: 22rpx; }
	.dispute-record-card__heading { margin-right: -34rpx; }
	.dispute-record-card__category { font-size: 31rpx; }
	.dispute-record-card__label { flex-basis: 126rpx; }
	.dispute-record-card__row { font-size: 26rpx; }
}
</style>
