<script setup lang="ts">
import AppNavigationBar from '@/components/AppNavigationBar.vue'
import { onShow } from '@dcloudio/uni-app'
import { useDisputeRecords } from '@/composables/useDisputeRecords'
import type { ViolationRecord } from '@/data/prototypeDisputes'

const { violations, refresh } = useDisputeRecords()
onShow(refresh)

function openRelatedDispute(id?: string) {
	if (!id) {
		uni.showToast({ title: '暂无关联的投诉处理详情', icon: 'none' })
		return
	}
	uni.navigateTo({ url: `/pages/dispute-detail/index?id=${encodeURIComponent(id)}` })
}

function openRecord(record: ViolationRecord) {
	openRelatedDispute(record.relatedDisputeId)
}
</script>

<template>
	<view class="violation-records-page">
	  <AppNavigationBar title="违约记录" :show-back="true" />
		<scroll-view class="violation-records-page__scroll" scroll-y>
			<view v-if="violations.length" class="violation-records-list">
				<view v-for="record in violations" :key="record.id" class="violation-record-card">
					<view
						class="violation-record-card__trigger"
						role="button"
						:aria-label="`${record.type}，订单编号 ${record.orderNo}，处理时间 ${record.handledAt}`"
						hover-class="violation-record-card__trigger--pressed"
						hover-stay-time="70"
						@tap="openRecord(record)"
					>
						<view class="violation-record-card__heading">
							<text class="violation-record-card__type">{{ record.type }}</text>
							<view class="violation-record-card__chevron" aria-hidden="true" />
						</view>
						<view class="violation-record-card__row">
							<text class="violation-record-card__label">订单编号</text>
							<text class="violation-record-card__value">{{ record.orderNo }}</text>
						</view>
						<view class="violation-record-card__row">
							<text class="violation-record-card__label">处理时间</text>
							<text class="violation-record-card__value">{{ record.handledAt }}</text>
						</view>
					</view>
				</view>
			</view>
			<view v-else class="violation-records-empty">
				<view class="violation-records-empty__icon" aria-hidden="true">✓</view>
				<text>暂无违约记录</text>
			</view>
		</scroll-view>
	</view>
</template>

<style scoped>
.violation-records-page { display: flex; box-sizing: border-box; height: 100vh; height: 100dvh; min-height: 0; flex-direction: column;  overflow: hidden; background: #f4f7fb; }
.violation-records-page__scroll { flex: 1; min-height: 0; width: 100%; }
.violation-records-list { display: flex; flex-direction: column; padding: 10rpx 0 32rpx; }
.violation-record-card { box-sizing: border-box; margin: 18rpx 24rpx; overflow: hidden; border: 1rpx solid #eef1f5; border-radius: 26rpx; background: #ffffff; box-shadow: 0 8rpx 24rpx rgba(40, 73, 116, 0.05); }
.violation-record-card__trigger { position: relative; padding: 30rpx 76rpx 29rpx 30rpx; transition: opacity 0.16s ease; }
.violation-record-card__trigger--pressed { opacity: 0.7; }
.violation-record-card__heading { display: flex; min-height: 54rpx; align-items: center; justify-content: space-between; gap: 16rpx; margin-bottom: 18rpx; }
.violation-record-card__type { color: #17243a; font-size: 36rpx; font-weight: 700; line-height: 50rpx; word-break: break-word; }
.violation-record-card__chevron { box-sizing: border-box; width: 19rpx; height: 19rpx; flex: 0 0 19rpx; border-top: 4rpx solid #8290a4; border-right: 4rpx solid #8290a4; transform: rotate(45deg); }
.violation-record-card__row { display: flex; align-items: flex-start; gap: 18rpx; margin-top: 12rpx; font-size: 29rpx; line-height: 43rpx; }
.violation-record-card__label { flex: 0 0 150rpx; color: #7d8ba2; }
.violation-record-card__value { min-width: 0; flex: 1; color: #25334b; word-break: break-all; }
.violation-records-empty { display: flex; min-height: 540rpx; flex-direction: column; align-items: center; justify-content: center; color: #95a0b0; font-size: 28rpx; }
.violation-records-empty__icon { display: flex; width: 86rpx; height: 86rpx; align-items: center; justify-content: center; margin-bottom: 18rpx; border-radius: 50%; color: #ffffff; background: #8bc7aa; font-size: 48rpx; }

@media screen and (max-width: 360px) {
	.violation-record-card { margin-right: 16rpx; margin-left: 16rpx; }
	.violation-record-card__trigger { padding-right: 58rpx; padding-left: 22rpx; }
	.violation-record-card__row { font-size: 26rpx; }
	.violation-record-card__label { flex-basis: 128rpx; }
}
</style>
