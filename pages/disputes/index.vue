<script setup lang="ts">
import AppNavigationBar from '@/components/AppNavigationBar.vue'
import { computed, shallowRef } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import DisputeRecordCard from '@/components/disputes/DisputeRecordCard.vue'
import { useDisputeRecords } from '@/composables/useDisputeRecords'
import type { DisputeStatus } from '@/data/prototypeDisputes'

type DisputeFilter = 'all' | DisputeStatus

const { disputes, refresh } = useDisputeRecords()
const activeFilter = shallowRef<DisputeFilter>('all')
const filters: Array<{ key: DisputeFilter; label: string }> = [
	{ key: 'all', label: '全部' },
	{ key: 'pending-response', label: '待回应' },
	{ key: 'processing', label: '处理中' },
	{ key: 'established', label: '成立' },
	{ key: 'not-established', label: '不成立' }
]

const visibleDisputes = computed(() =>
	activeFilter.value === 'all'
		? disputes.value
		: disputes.value.filter((record) => record.status === activeFilter.value)
)

onShow(refresh)

function openDispute(id: string) {
	uni.navigateTo({ url: `/pages/dispute-detail/index?id=${encodeURIComponent(id)}` })
}
</script>

<template>
	<view class="disputes-page">
	  <AppNavigationBar title="争议处理" :show-back="true" />

		<view class="disputes-filter" role="tablist" aria-label="争议状态筛选">
			<view
				v-for="filter in filters"
				:key="filter.key"
				class="disputes-filter__item"
				:class="{ 'disputes-filter__item--active': activeFilter === filter.key }"
				role="tab"
				:aria-selected="activeFilter === filter.key"
				@tap="activeFilter = filter.key"
			>
				<text>{{ filter.label }}</text>
				<view v-if="activeFilter === filter.key" class="disputes-filter__indicator" />
			</view>
		</view>

		<scroll-view class="disputes-page__scroll" scroll-y>
			<view v-if="visibleDisputes.length" class="disputes-page__list">
				<DisputeRecordCard
					v-for="record in visibleDisputes"
					:key="record.id"
					:record="record"
					@open="openDispute"
				/>
			</view>
			<view v-else class="disputes-empty-state">
				<view class="disputes-empty-state__icon" aria-hidden="true">
					<view />
					<view />
					<view />
				</view>
				<text>当前分类暂无争议</text>
			</view>
		</scroll-view>
	</view>
</template>

<style scoped>
.disputes-page {
	display: flex;
	box-sizing: border-box;
	height: 100vh;
	height: 100dvh;
	min-height: 0;
	flex-direction: column;

	overflow: hidden;
	background: #f5f7fb;
}

.disputes-filter {
	display: flex;
  flex: 0 0 94rpx;
	align-items: stretch;
	justify-content: space-around;
  border-bottom: 1rpx solid #e8eaf0;
	background: #ffffff;
}

.disputes-filter__item {
	position: relative;
	display: flex;
	flex: 1;
	min-width: 0;
	align-items: center;
	justify-content: center;
  color: #252c37;
  font-size: 27rpx;
	white-space: nowrap;
}

.disputes-filter__item--active {
  color: #111827;
	font-weight: 700;
}

.disputes-filter__indicator {
	position: absolute;
  bottom: 6rpx;
	left: 50%;
  width: 54rpx;
	height: 8rpx;
	border-radius: 999rpx;
  background: #5b8af1;
	transform: translateX(-50%);
}

.disputes-page__scroll {
	flex: 1;
	min-height: 0;
	width: 100%;
}

.disputes-page__list {
	display: flex;
	flex-direction: column;
	padding: 6rpx 0 30rpx;
}

.disputes-empty-state {
	display: flex;
	min-height: 560rpx;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: #98a2b2;
	font-size: 28rpx;
}

.disputes-empty-state__icon {
	position: relative;
	display: flex;
	width: 100rpx;
	height: 78rpx;
	align-items: center;
	justify-content: center;
	gap: 9rpx;
	margin-bottom: 24rpx;
	border: 5rpx solid #c4d3ea;
	border-radius: 28rpx;
	background: #edf3fc;
}

.disputes-empty-state__icon::after {
	position: absolute;
	bottom: -16rpx;
	left: 18rpx;
	width: 22rpx;
	height: 22rpx;
	border-bottom: 5rpx solid #c4d3ea;
	border-left: 5rpx solid #c4d3ea;
	background: #edf3fc;
	content: '';
	transform: skewY(-34deg);
}

.disputes-empty-state__icon > view {
	width: 9rpx;
	height: 9rpx;
	border-radius: 50%;
	background: #94acd0;
}

@media screen and (max-width: 360px) {
	.disputes-filter__item { font-size: 24rpx; }
}
</style>
