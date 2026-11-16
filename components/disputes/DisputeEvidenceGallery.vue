<script setup lang="ts">
import type { DisputeEvidence } from '@/data/prototypeDisputes'

const props = withDefaults(defineProps<{
	title: string
	items: DisputeEvidence[]
	editable?: boolean
	compactImages?: boolean
	max?: number
}>(), {
	editable: false,
	compactImages: false,
	max: 9
})

const emit = defineEmits<{
	add: []
	remove: [index: number]
}>()

function preview(item: DisputeEvidence) {
	if (!item.path) return
	const urls = props.items.filter((evidence) => evidence.path).map((evidence) => evidence.path as string)
	if (!urls.length) return
	uni.previewImage({ current: item.path, urls })
}
</script>

<template>
	<view class="evidence-gallery" :class="{ 'evidence-gallery--compact-images': compactImages }">
		<view class="evidence-gallery__heading">
			<text class="evidence-gallery__title">{{ title }}</text>
			<text v-if="editable" class="evidence-gallery__limit">最多 {{ max }} 张</text>
		</view>
		<view v-if="items.length || editable" class="evidence-gallery__grid">
			<view
				v-for="(item, index) in items"
				:key="item.id"
				class="evidence-tile"
				:class="[`evidence-tile--${item.kind}`, { 'evidence-tile--photo': item.path }]"
				:role="item.path ? 'button' : undefined"
				:aria-label="`${item.label}，${item.detail}`"
				@tap="preview(item)"
			>
				<image v-if="item.path" class="evidence-tile__image" :src="item.path" mode="aspectFill" />
				<view v-else class="evidence-tile__preview" aria-hidden="true">
					<view v-if="item.kind === 'chat'" class="evidence-chat-preview">
						<view v-for="time in ['08:45', '08:50', '08:55']" :key="time" class="evidence-chat-preview__row">
							<text>{{ time }}</text><view class="evidence-chat-preview__bubble">在吗？</view><view class="evidence-chat-preview__alert">!</view>
						</view>
					</view>
					<view v-else-if="item.kind === 'call'" class="evidence-call-preview">
						<text class="evidence-call-preview__title">通话记录</text>
						<view v-for="time in ['08:45', '08:50', '08:55']" :key="time" class="evidence-call-preview__row">
							<view class="evidence-call-preview__phone">↗</view><text>{{ time }}</text><text>未接通</text>
						</view>
					</view>
					<view v-else-if="item.kind === 'route'" class="evidence-route-preview">
						<view class="evidence-route-preview__street evidence-route-preview__street--one" />
						<view class="evidence-route-preview__street evidence-route-preview__street--two" />
						<view class="evidence-route-preview__path" />
						<view class="evidence-route-preview__pin evidence-route-preview__pin--start">R</view>
						<view class="evidence-route-preview__pin evidence-route-preview__pin--end">B</view>
						<view class="evidence-route-preview__summary">行程记录 · 08:10 - 09:15</view>
					</view>
					<view v-else class="evidence-document-preview">
						<text class="evidence-document-preview__title">{{ item.kind === 'hospital' ? '医院现场' : '就诊记录' }}</text>
						<view class="evidence-document-preview__row"><text>就诊时间</text><view /></view>
						<view class="evidence-document-preview__row"><text>就诊科室</text><view /></view>
						<view class="evidence-document-preview__row"><text>订单状态</text><view /></view>
					</view>
				</view>
				<view class="evidence-tile__caption">
					<text class="evidence-tile__label">{{ item.label }}</text>
					<text class="evidence-tile__detail">{{ item.detail }}</text>
				</view>
				<view
					v-if="editable"
					class="evidence-tile__remove"
					role="button"
					:aria-label="`删除${item.label}`"
					@tap.stop="emit('remove', index)"
				>×</view>
			</view>
			<view
				v-if="editable && items.length < max"
				class="evidence-tile evidence-tile--add"
				role="button"
				aria-label="添加凭证图片"
				@tap="emit('add')"
			>
				<text class="evidence-tile__plus" aria-hidden="true">+</text>
				<text class="evidence-tile__add-label">添加凭证</text>
				<text class="evidence-tile__add-count">{{ items.length }}/{{ max }}</text>
			</view>
		</view>
		<text v-else class="evidence-gallery__empty">暂无凭证</text>
	</view>
</template>

<style scoped>
.evidence-gallery { box-sizing: border-box; padding: 28rpx; border-radius: 24rpx; background: #ffffff; }
.evidence-gallery__heading { display: flex; align-items: baseline; justify-content: space-between; gap: 14rpx; margin-bottom: 20rpx; }
.evidence-gallery__title { color: #17243a; font-size: 32rpx; font-weight: 700; line-height: 46rpx; }
.evidence-gallery__limit { color: #7d8ba1; font-size: 24rpx; line-height: 36rpx; }
.evidence-gallery__grid { display: flex; flex-wrap: wrap; gap: 14rpx; }
.evidence-tile { position: relative; display: flex; box-sizing: border-box; width: calc((100% - 28rpx) / 3); min-width: 0; min-height: 216rpx; flex-direction: column; overflow: hidden; border-radius: 16rpx; background: #edf3fa; }
.evidence-tile--photo { min-height: 216rpx; }
.evidence-tile__image { display: block; width: 100%; height: 216rpx; }
.evidence-gallery--compact-images .evidence-tile__image { height: 130rpx; flex: 0 0 130rpx; }
.evidence-tile__preview { position: relative; display: flex; height: 130rpx; flex: 0 0 130rpx; align-items: center; justify-content: center; overflow: hidden; background: #edf3fa; }
.evidence-chat-preview { display: flex; box-sizing: border-box; width: 100%; flex-direction: column; justify-content: center; gap: 5rpx; padding: 10rpx 8rpx; background: #eef3f9; }
.evidence-chat-preview__row { display: flex; min-width: 0; align-items: center; gap: 5rpx; color: #7b8ba4; font-size: 16rpx; line-height: 23rpx; }
.evidence-chat-preview__bubble { min-width: 0; flex: 1; padding: 3rpx 7rpx; border-radius: 8rpx; color: #174626; background: #79d985; font-size: 18rpx; text-align: center; }
.evidence-chat-preview__alert { display: flex; width: 21rpx; height: 21rpx; flex: 0 0 21rpx; align-items: center; justify-content: center; border-radius: 50%; color: #ffffff; background: #f24b4b; font-size: 16rpx; font-weight: 700; }
.evidence-call-preview { box-sizing: border-box; width: 100%; padding: 8rpx 13rpx; background: #f2f4f8; }
.evidence-call-preview__title { display: block; margin-bottom: 4rpx; color: #263751; font-size: 18rpx; font-weight: 700; line-height: 25rpx; }
.evidence-call-preview__row { display: flex; align-items: center; gap: 6rpx; color: #37455b; font-size: 16rpx; line-height: 27rpx; }
.evidence-call-preview__row > text:last-child { margin-left: auto; }
.evidence-call-preview__phone { display: flex; width: 18rpx; height: 18rpx; align-items: center; justify-content: center; border-radius: 50%; color: #ffffff; background: #ef5555; font-size: 13rpx; }
.evidence-route-preview { position: relative; width: 100%; height: 100%; overflow: hidden; background: #e9f3ec; }
.evidence-route-preview__street { position: absolute; width: 140%; height: 11rpx; border: 4rpx solid #ffffff; background: #d1dfd7; transform: rotate(-18deg); }
.evidence-route-preview__street--one { top: 25rpx; left: -32rpx; }
.evidence-route-preview__street--two { top: 75rpx; left: -24rpx; transform: rotate(21deg); }
.evidence-route-preview__path { position: absolute; top: 37rpx; left: 47rpx; width: 113rpx; height: 44rpx; border-bottom: 6rpx solid #348af0; border-right: 6rpx solid #348af0; border-radius: 0 0 18rpx 0; transform: skewY(-13deg); }
.evidence-route-preview__pin { position: absolute; top: 21rpx; display: flex; width: 22rpx; height: 22rpx; align-items: center; justify-content: center; border: 3rpx solid #ffffff; border-radius: 50%; color: #ffffff; font-size: 12rpx; font-weight: 700; }
.evidence-route-preview__pin--start { left: 36rpx; background: #18ae72; }
.evidence-route-preview__pin--end { right: 42rpx; background: #ef5a51; }
.evidence-route-preview__summary { position: absolute; right: 6rpx; bottom: 5rpx; left: 6rpx; padding: 4rpx 7rpx; border-radius: 6rpx; color: #253653; background: rgba(255, 255, 255, 0.94); font-size: 15rpx; line-height: 21rpx; }
.evidence-document-preview { box-sizing: border-box; width: 100%; height: 100%; padding: 9rpx 12rpx; background: linear-gradient(145deg, #e9eef7, #f7f9fc); }
.evidence-document-preview__title { display: block; margin-bottom: 5rpx; color: #263858; font-size: 18rpx; font-weight: 700; line-height: 24rpx; }
.evidence-document-preview__row { display: flex; align-items: center; gap: 6rpx; color: #7d8ba2; font-size: 14rpx; line-height: 23rpx; }
.evidence-document-preview__row > view { height: 5rpx; flex: 1; border-radius: 99rpx; background: #8e9eb8; }
.evidence-document-preview__row:nth-child(3) > view { max-width: 58%; }
.evidence-tile__caption { display: flex; min-height: 78rpx; flex-direction: column; justify-content: center; gap: 3rpx; padding: 7rpx 10rpx; }
.evidence-tile__label { overflow: hidden; color: #20314d; font-size: 23rpx; font-weight: 650; line-height: 32rpx; text-overflow: ellipsis; white-space: nowrap; }
.evidence-tile__detail { display: -webkit-box; overflow: hidden; color: #77869e; font-size: 19rpx; line-height: 26rpx; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.evidence-tile__remove { position: absolute; top: 7rpx; right: 7rpx; z-index: 1; display: flex; width: 38rpx; height: 38rpx; align-items: center; justify-content: center; border-radius: 50%; color: #ffffff; background: rgba(31, 43, 60, 0.58); font-size: 32rpx; line-height: 1; }
.evidence-tile--add { align-items: center; justify-content: center; border: 2rpx dashed #cad5e4; color: #7f8da2; background: #fafcff; }
.evidence-tile__plus { color: #a7b2c1; font-size: 61rpx; font-weight: 300; line-height: 64rpx; }
.evidence-tile__add-label { font-size: 21rpx; line-height: 29rpx; }
.evidence-tile__add-count { margin-top: 3rpx; color: #8494ac; font-size: 20rpx; line-height: 28rpx; }
.evidence-gallery__empty { color: #8794a9; font-size: 27rpx; line-height: 42rpx; }

@media screen and (max-width: 360px) {
	.evidence-gallery { padding: 22rpx; }
	.evidence-tile { min-height: 194rpx; }
	.evidence-tile__image { height: 194rpx; }
	.evidence-tile__label { font-size: 21rpx; }
	.evidence-tile__detail { font-size: 18rpx; }
}
</style>
