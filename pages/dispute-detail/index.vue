<script setup lang="ts">
import AppNavigationBar from '@/components/AppNavigationBar.vue'
import { computed, shallowRef } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import DisputeEvidenceGallery from '@/components/disputes/DisputeEvidenceGallery.vue'
import DisputeOrderCard from '@/components/disputes/DisputeOrderCard.vue'
import { useDisputeRecords } from '@/composables/useDisputeRecords'
import { disputeOrderId } from '@/composables/useOrderRecords'
import type { DisputeStatus } from '@/data/prototypeDisputes'

const { disputes, refresh } = useDisputeRecords()
const disputeId = shallowRef('')
const record = computed(() => disputes.value.find((item) => item.id === disputeId.value))
const isPending = computed(() => record.value?.status === 'pending-response')

const statusMeta: Record<DisputeStatus, { title: string; description: string }> = {
	'pending-response': {
		title: '待回应',
		description: '请在截止时间前提交说明和凭证，逾期平台将根据现有材料进行审核。'
	},
	processing: {
		title: '平台处理中',
		description: '平台正在审核双方材料，请耐心等待。'
	},
	established: {
		title: '投诉成立',
		description: '经核实，认定陪诊师存在违约行为。'
	},
	'not-established': {
		title: '投诉不成立',
		description: '经核实，未发现陪诊师存在违约行为。'
	}
}

const statusInfo = computed(() => record.value ? statusMeta[record.value.status] : null)
const outcomeRows = computed(() => {
	const outcome = record.value?.outcome
	if (!outcome) return []
	if (record.value?.status === 'established') {
		return [
			{ label: '违约类型', value: outcome.breachType, emphasis: false },
			{ label: '信誉处理', value: outcome.reputationAction, emphasis: true },
			{ label: '订单资金处理', value: outcome.orderFunds, emphasis: true },
			{ label: '陪诊师收益处理', value: outcome.attendantIncome, emphasis: true },
			{ label: '接单限制', value: outcome.acceptanceRestriction, emphasis: false },
			{ label: '处理时间', value: outcome.handledAt, emphasis: false },
			{ label: '平台说明', value: outcome.platformExplanation, emphasis: false }
		]
	}
	return [
		{ label: '处理时间', value: outcome.handledAt, emphasis: false },
		{ label: '平台说明', value: outcome.platformExplanation, emphasis: false }
	]
})

onLoad((options) => {
	disputeId.value = typeof options?.id === 'string' ? options.id : ''
})

onShow(refresh)

function submitResponse() {
	if (!record.value) return
	uni.navigateTo({ url: `/pages/dispute-response/index?id=${encodeURIComponent(record.value.id)}` })
}

function openOrderDetails() {
	if (!record.value) return
	uni.navigateTo({ url: `/pages/service/index?orderId=${encodeURIComponent(disputeOrderId(record.value.orderNo))}` })
}

function openDisputeList() {
	uni.redirectTo({ url: '/pages/disputes/index' })
}
</script>

<template>
	<view class="dispute-detail-page" :class="{ 'dispute-detail-page--with-footer': isPending }">
	  <AppNavigationBar title="争议详情" :show-back="true" />

		<scroll-view v-if="record && statusInfo" class="dispute-detail-page__scroll" scroll-y>
			<view class="dispute-status" :class="`dispute-status--${record.status}`">
				<view class="dispute-status__icon" aria-hidden="true">
					<image
						v-if="record.status === 'processing'"
						class="dispute-status__icon-image dispute-status__icon-image--processing"
						src="/static/images/dispute-processing-icon.png"
						mode="aspectFit"
					/>
					<image
						v-else-if="record.status === 'established'"
						class="dispute-status__icon-image dispute-status__icon-image--established"
						src="/static/images/dispute-established-icon.png"
						mode="aspectFit"
					/>
					<view v-else class="dispute-status__illustration" :class="`dispute-status__illustration--${record.status}`"><view /></view>
				</view>
				<view class="dispute-status__copy">
					<text class="dispute-status__title">{{ statusInfo.title }}</text>
					<text class="dispute-status__description">{{ statusInfo.description }}</text>
				</view>
			</view>

			<view v-if="record.status === 'pending-response' && record.responseDeadline" class="response-deadline">
				<image class="response-deadline__clock" src="/static/images/dispute-deadline-calendar.png" mode="aspectFit" aria-hidden="true" />
				<text>回应截止时间：{{ record.responseDeadline }}</text>
			</view>

			<view v-if="record.outcome" class="dispute-info-card dispute-info-card--outcome">
				<text class="dispute-section-title">{{ record.status === 'established' ? '处理措施' : '处理结果' }}</text>
				<view v-for="row in outcomeRows" :key="row.label" class="outcome-row">
					<text class="outcome-row__label">{{ row.label }}：</text>
					<text class="outcome-row__value" :class="{ 'outcome-row__value--emphasis': row.emphasis }">{{ row.value }}</text>
				</view>
			</view>

			<DisputeOrderCard :order="record.order" :order-no="record.orderNo" @open="openOrderDetails" />
			<view class="order-detail-hint">
				<text class="order-detail-hint__info" aria-hidden="true">i</text>
				<text>点击订单即可查看订单详情</text>
			</view>

			<view class="dispute-info-card">
				<text class="dispute-section-title">用户投诉信息</text>
				<view class="dispute-info-row">
					<text class="dispute-info-row__label">投诉类型：</text>
					<text class="dispute-info-row__value">{{ record.complaint.type }}</text>
				</view>
				<view class="dispute-info-row">
					<text class="dispute-info-row__label">投诉时间：</text>
					<text class="dispute-info-row__value">{{ record.filedAt }}</text>
				</view>
				<view class="dispute-info-row dispute-info-row--top">
					<text class="dispute-info-row__label">问题说明：</text>
					<text class="dispute-info-row__value">{{ record.complaint.description }}</text>
				</view>
			</view>

			<view class="dispute-evidence-section">
				<DisputeEvidenceGallery title="用户上传凭证" :items="record.complaint.evidence" compact-images />
			</view>

			<view v-if="record.response" class="dispute-info-card">
				<text class="dispute-section-title">陪诊师回应说明</text>
				<view class="dispute-info-row">
					<text class="dispute-info-row__label">回应类型：</text>
					<text class="dispute-info-row__value">{{ record.response.type }}</text>
				</view>
				<view class="dispute-info-row">
					<text class="dispute-info-row__label">回应时间：</text>
					<text class="dispute-info-row__value">{{ record.response.submittedAt }}</text>
				</view>
				<view class="dispute-info-row dispute-info-row--top">
					<text class="dispute-info-row__label">情况说明：</text>
					<text class="dispute-info-row__value">{{ record.response.description }}</text>
				</view>
			</view>

			<view v-if="record.response" class="dispute-evidence-section">
				<DisputeEvidenceGallery title="陪诊师上传凭证" :items="record.response.evidence" />
			</view>

			<view class="dispute-detail-page__bottom-space" />
		</scroll-view>

		<view v-else class="dispute-detail-empty">
			<view class="dispute-detail-empty__mark" aria-hidden="true">?</view>
			<text class="dispute-detail-empty__title">未找到这条争议记录</text>
			<view class="dispute-detail-empty__button" role="button" @tap="openDisputeList">返回争议列表</view>
		</view>

		<view v-if="record && isPending" class="dispute-detail-footer">
			<view
				class="dispute-detail-footer__button"
				role="button"
				@tap="submitResponse"
			>
				提交说明
			</view>
		</view>
	</view>
</template>

<style scoped>
.dispute-detail-page {
	display: flex;
	box-sizing: border-box;
	height: 100vh;
	height: 100dvh;
	min-height: 0;
	flex-direction: column;

	overflow: hidden;
	background: #f3f7fc;
}

.dispute-detail-page--with-footer { padding-bottom: calc(132rpx + env(safe-area-inset-bottom)); }
.dispute-detail-page__scroll { flex: 1; min-height: 0; width: 100%; }

.dispute-status {
	position: relative;
	display: flex;
	box-sizing: border-box;
	align-items: center;
	gap: 26rpx;
	min-height: 220rpx;
	margin: 24rpx 24rpx 18rpx;
	padding: 28rpx;
	overflow: hidden;
	border-radius: 26rpx;
	background: linear-gradient(110deg, #fff0f1, #fff7f7);
	box-shadow: 0 9rpx 24rpx rgba(62, 91, 130, 0.06);
}

.dispute-status--processing { color: #ffffff; background: linear-gradient(110deg, #3986f8, #78bdfd); }
.dispute-status--established { color: #ffffff; background: linear-gradient(110deg, #fa5150, #fe8483); }
.dispute-status--not-established { color: #1d8f52; background: linear-gradient(110deg, #dcf6e9, #effbf4); }
.dispute-status__icon { display: flex; flex: 0 0 144rpx; width: 144rpx; height: 144rpx; align-items: center; justify-content: center; border-radius: 50%; background: rgba(240, 84, 96, 0.11); }
.dispute-status--processing .dispute-status__icon { background: transparent; }
.dispute-status--established .dispute-status__icon { background: rgba(255, 255, 255, 0.22); }
.dispute-status--not-established .dispute-status__icon { background: rgba(32, 170, 93, 0.14); }
.dispute-status__illustration { position: relative; display: flex; width: 100rpx; height: 100rpx; align-items: center; justify-content: center; }
.dispute-status__icon-image { display: block; }
.dispute-status__icon-image--processing { width: 112rpx; height: 112rpx; }
.dispute-status__icon-image--established { width: 144rpx; height: 144rpx; }
.dispute-status__illustration--pending-response::before { width: 57rpx; height: 68rpx; border-radius: 8rpx; background: #f45b66; box-shadow: 0 8rpx 13rpx rgba(198, 68, 83, 0.18); content: ''; }
.dispute-status__illustration--pending-response > view { position: absolute; top: 32rpx; left: 30rpx; width: 34rpx; height: 6rpx; border-radius: 8rpx; background: #ffffff; }
.dispute-status__illustration--pending-response > view::before,
.dispute-status__illustration--pending-response > view::after { position: absolute; left: 0; width: 26rpx; height: 6rpx; border-radius: 8rpx; background: #ffffff; content: ''; }
.dispute-status__illustration--pending-response > view::before { top: 14rpx; }
.dispute-status__illustration--pending-response > view::after { top: 28rpx; width: 18rpx; }
.dispute-status__illustration--pending-response::after { position: absolute; right: 9rpx; bottom: 9rpx; display: flex; width: 32rpx; height: 32rpx; align-items: center; justify-content: center; border: 4rpx solid #fff0f1; border-radius: 50%; color: #ffffff; background: #f34f58; content: '!'; font-size: 25rpx; font-weight: 700; }
.dispute-status__illustration--not-established { border: 8rpx solid #2fa85e; border-radius: 50%; background: #2fa85e; }
.dispute-status__illustration--not-established > view { width: 43rpx; height: 23rpx; border-bottom: 10rpx solid #ffffff; border-left: 10rpx solid #ffffff; transform: translateY(-5rpx) rotate(-45deg); }
.dispute-status__copy { position: relative; z-index: 1; display: flex; min-width: 0; flex: 1; flex-direction: column; }
.dispute-status__title { color: #ec4e58; font-size: 43rpx; font-weight: 750; line-height: 58rpx; }
.dispute-status--processing .dispute-status__title,
.dispute-status--established .dispute-status__title { color: #ffffff; }
.dispute-status--not-established .dispute-status__title { color: currentColor; }
.dispute-status__description { margin-top: 8rpx; color: #45546d; font-size: 28rpx; line-height: 42rpx; }
.dispute-status--processing .dispute-status__description,
.dispute-status--established .dispute-status__description { color: rgba(255, 255, 255, 0.92); font-size: 26rpx; line-height: 39rpx; }
.dispute-status--not-established .dispute-status__description { color: #3b4a5e; }

@media screen and (max-width: 360px) {
	.dispute-status { gap: 14rpx; min-height: 220rpx; margin-right: 16rpx; margin-left: 16rpx; padding: 22rpx; }
	.dispute-status__icon { width: 124rpx; height: 124rpx; flex-basis: 124rpx; }
	.dispute-status__icon-image--established { width: 124rpx; height: 124rpx; }
	.dispute-status__title { font-size: 38rpx; line-height: 50rpx; }
	.dispute-status__description { font-size: 24rpx; line-height: 35rpx; }
}

.response-deadline { display: flex; min-height: 68rpx; align-items: center; justify-content: center; gap: 14rpx; margin: 0 24rpx 18rpx; padding: 0 16rpx; border-radius: 999rpx; color: #e64d52; background: #fff0f0; font-size: 27rpx; line-height: 38rpx; }
.response-deadline__clock { display: block; width: 30rpx; height: 30rpx; flex: 0 0 30rpx; }

.dispute-info-card { box-sizing: border-box; margin: 18rpx 24rpx; padding: 28rpx; border: 1rpx solid #edf0f5; border-radius: 24rpx; background: #ffffff; box-shadow: 0 8rpx 22rpx rgba(48, 82, 125, 0.05); }
.dispute-section-title { display: block; margin-bottom: 18rpx; color: #17243a; font-size: 33rpx; font-weight: 700; line-height: 46rpx; }

.order-detail-hint { display: flex; min-height: 68rpx; align-items: center; gap: 14rpx; margin: -8rpx 24rpx 18rpx; padding: 8rpx 22rpx; border-radius: 16rpx; color: #7182a0; background: #eaf1fb; font-size: 25rpx; line-height: 36rpx; }
.order-detail-hint__info { display: flex; width: 31rpx; height: 31rpx; align-items: center; justify-content: center; border: 3rpx solid currentColor; border-radius: 50%; font-size: 22rpx; font-weight: 700; }

.dispute-info-card { padding-bottom: 30rpx; }
.dispute-info-row,
.outcome-row { display: flex; align-items: flex-start; gap: 10rpx; margin-top: 12rpx; font-size: 28rpx; line-height: 42rpx; }
.dispute-info-row--top { margin-top: 15rpx; }
.dispute-info-row__label,
.outcome-row__label { flex: 0 0 150rpx; color: #7888a4; }
.dispute-info-row__value,
.outcome-row__value { min-width: 0; flex: 1; color: #23334f; word-break: break-word; }
.dispute-info-card--outcome { padding-bottom: 27rpx; }
.outcome-row { padding-bottom: 11rpx; border-bottom: 1rpx solid #edf0f5; }
.outcome-row:last-child { padding-bottom: 0; border-bottom: 0; }
.outcome-row__value--emphasis { color: #e74d4d; font-weight: 650; }
.dispute-evidence-section { margin: 18rpx 24rpx; }
.dispute-detail-page__bottom-space { height: 28rpx; }

.dispute-detail-empty { display: flex; flex: 1; flex-direction: column; align-items: center; justify-content: center; padding: 32rpx; color: #8390a3; }
.dispute-detail-empty__mark { display: flex; width: 88rpx; height: 88rpx; align-items: center; justify-content: center; margin-bottom: 20rpx; border-radius: 50%; color: #ffffff; background: #9db1cc; font-size: 54rpx; }
.dispute-detail-empty__title { font-size: 29rpx; line-height: 42rpx; }
.dispute-detail-empty__button { display: flex; min-height: 72rpx; align-items: center; justify-content: center; margin-top: 26rpx; padding: 0 36rpx; border-radius: 999rpx; color: #ffffff; background: #5b8af1; font-size: 28rpx; }

.dispute-detail-footer { position: fixed; right: 0; bottom: 0; left: 0; box-sizing: border-box; padding: 14rpx 32rpx calc(17rpx + env(safe-area-inset-bottom)); background: rgba(255, 255, 255, 0.98); box-shadow: 0 -8rpx 22rpx rgba(33, 69, 111, 0.06); }
.dispute-detail-footer__button { display: flex; min-height: 84rpx; align-items: center; justify-content: center; border-radius: 999rpx; color: #ffffff; background: linear-gradient(105deg, #6397f5, #3e68ea); font-size: 33rpx; font-weight: 650; }

@media screen and (max-width: 360px) {
	.dispute-status { gap: 16rpx; margin-right: 16rpx; margin-left: 16rpx; padding: 20rpx; }
	.dispute-status__icon { flex-basis: 112rpx; width: 112rpx; height: 112rpx; }
	.dispute-status__title { font-size: 37rpx; }
	.dispute-status__description { font-size: 25rpx; line-height: 37rpx; }
	.dispute-info-card { margin-right: 16rpx; margin-left: 16rpx; padding: 22rpx; }
	.dispute-evidence-section { margin-right: 16rpx; margin-left: 16rpx; }
	.dispute-info-row, .outcome-row { font-size: 25rpx; line-height: 38rpx; }
	.dispute-info-row__label, .outcome-row__label { flex-basis: 132rpx; }
}
</style>
