<script setup lang="ts">
import AppNavigationBar from '@/components/AppNavigationBar.vue'
import { computed, ref, shallowRef } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import DisputeEvidenceGallery from '@/components/disputes/DisputeEvidenceGallery.vue'
import { useDisputeRecords } from '@/composables/useDisputeRecords'
import { responseTypes, type DisputeEvidence, type DisputeResponseType } from '@/data/prototypeDisputes'

const { disputes, submitResponse } = useDisputeRecords()
const disputeId = shallowRef('')
const selectedType = shallowRef<DisputeResponseType | ''>('')
const description = ref('')
const evidence = ref<DisputeEvidence[]>([])
const isSaving = shallowRef(false)

const record = computed(() => disputes.value.find((item) => item.id === disputeId.value))
const contentCount = computed(() => description.value.length)

onLoad((options) => {
	disputeId.value = typeof options?.id === 'string' ? options.id : ''
})

function selectType(type: DisputeResponseType) {
	selectedType.value = type
}

function addEvidence() {
	const remaining = 9 - evidence.value.length
	if (remaining <= 0) {
		uni.showToast({ title: '最多上传 9 张凭证', icon: 'none' })
		return
	}

	uni.chooseImage({
		count: remaining,
		sourceType: ['album', 'camera'],
		success: (result) => {
			const additions = (result.tempFilePaths || []).map((path, index) => ({
				id: `response-${Date.now()}-${index}`,
				kind: 'image' as const,
				label: `现场凭证 ${evidence.value.length + index + 1}`,
				detail: '本机图片预览',
				path
			}))
			evidence.value = [...evidence.value, ...additions].slice(0, 9)
		}
	})
}

function removeEvidence(index: number) {
	evidence.value = evidence.value.filter((_, itemIndex) => itemIndex !== index)
}

function currentLocalTime() {
	const date = new Date()
	const pad = (value: number) => String(value).padStart(2, '0')
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function submit() {
	if (isSaving.value) return
	if (!selectedType.value) {
		uni.showToast({ title: '请选择回应类型', icon: 'none' })
		return
	}
	if (!description.value.trim()) {
		uni.showToast({ title: '请填写情况说明', icon: 'none' })
		return
	}
	if (!record.value) {
		uni.showToast({ title: '未找到这条争议记录', icon: 'none' })
		return
	}
	if (record.value.status !== 'pending-response') {
		uni.showToast({ title: '当前争议无需提交说明', icon: 'none' })
		return
	}

	isSaving.value = true
	const saved = submitResponse(disputeId.value, {
		type: selectedType.value,
		description: description.value.trim(),
		submittedAt: currentLocalTime(),
		evidence: evidence.value
	})
	isSaving.value = false

	if (!saved) {
		uni.showToast({ title: '保存失败，请重试', icon: 'none' })
		return
	}

	uni.showToast({ title: '说明已提交', icon: 'success' })
	setTimeout(() => {
		uni.navigateBack({
			delta: 1,
			fail: () => uni.redirectTo({ url: `/pages/dispute-detail/index?id=${encodeURIComponent(disputeId.value)}` })
		})
	}, 300)
}
</script>

<template>
	<view class="dispute-response-page">
	  <AppNavigationBar title="提交说明" :show-back="true" />

		<scroll-view v-if="record" class="dispute-response-page__scroll" scroll-y>
			<view class="response-form-card response-form-card--type">
				<text class="response-form-card__title">回应类型 <text class="response-form-card__required">*</text></text>
				<view class="response-type-list" role="radiogroup" aria-label="回应类型">
					<view
						v-for="type in responseTypes"
						:key="type"
						class="response-type-option"
						role="radio"
						:aria-checked="selectedType === type"
						@tap="selectType(type)"
					>
						<view class="response-type-option__radio" :class="{ 'response-type-option__radio--selected': selectedType === type }">
							<view v-if="selectedType === type" />
						</view>
						<text>{{ type }}</text>
					</view>
				</view>
			</view>

			<view class="response-form-card">
				<text class="response-form-card__title">情况说明 <text class="response-form-card__required">*</text></text>
				<view class="response-textarea-wrap">
					<textarea
						v-model="description"
						class="response-textarea"
						maxlength="500"
						placeholder="请详细说明当时情况，并提供相关信息…"
						aria-label="情况说明"
					/>
					<text class="response-textarea__count">{{ contentCount }}/500</text>
				</view>
			</view>

			<view class="response-form-card response-form-card--evidence">
				<text class="response-form-card__description">聊天记录、现场照片、其他说明等</text>
				<DisputeEvidenceGallery
					title="上传凭证"
					:items="evidence"
					editable
					:max="9"
					@add="addEvidence"
					@remove="removeEvidence"
				/>
			</view>
			<view class="dispute-response-page__bottom-space" />
		</scroll-view>

		<view v-else class="response-missing">
			<text>未找到这条争议记录</text>
		</view>

		<view v-if="record" class="response-footer">
			<view
				class="response-footer__button"
				:class="{ 'response-footer__button--saving': isSaving }"
				role="button"
				aria-label="提交说明"
				@tap="submit"
			>
				{{ isSaving ? '正在提交…' : '提交说明' }}
			</view>
		</view>
	</view>
</template>

<style scoped>
.dispute-response-page { display: flex; box-sizing: border-box; height: 100vh; height: 100dvh; min-height: 0; flex-direction: column;  padding-bottom: calc(120rpx + env(safe-area-inset-bottom)); overflow: hidden; background: #f3f7fc; }
.dispute-response-page__scroll { flex: 1; min-height: 0; width: 100%; }
.response-form-card { box-sizing: border-box; margin: 18rpx 24rpx; padding: 28rpx; border-radius: 24rpx; background: #ffffff; box-shadow: 0 9rpx 26rpx rgba(44, 78, 121, 0.06); }
.response-form-card--type { margin-top: 22rpx; }
.response-form-card__title { display: block; color: #171e2b; font-size: 34rpx; font-weight: 700; line-height: 48rpx; }
.response-form-card__required { color: #ed4d54; }
.response-type-list { margin-top: 20rpx; }
.response-type-option { display: flex; min-height: 70rpx; align-items: center; gap: 19rpx; color: #222b3a; font-size: 30rpx; line-height: 44rpx; }
.response-type-option__radio { display: flex; box-sizing: border-box; width: 42rpx; height: 42rpx; flex: 0 0 42rpx; align-items: center; justify-content: center; border: 4rpx solid #b9c0cb; border-radius: 50%; }
.response-type-option__radio--selected { border-color: #5b8af1; }
.response-type-option__radio > view { width: 21rpx; height: 21rpx; border-radius: 50%; background: #5b8af1; }
.response-textarea-wrap { position: relative; box-sizing: border-box; min-height: 300rpx; margin-top: 20rpx; padding: 20rpx 20rpx 52rpx; border: 1rpx solid #dce2eb; border-radius: 18rpx; background: #fbfcfe; }
.response-textarea { display: block; width: 100%; height: 218rpx; color: #27354d; font-size: 29rpx; line-height: 1.55; }
.response-textarea__count { position: absolute; right: 18rpx; bottom: 13rpx; color: #818c9d; font-size: 25rpx; line-height: 36rpx; }
.response-form-card--evidence { padding: 25rpx 0 0; overflow: hidden; }
.response-form-card__description { display: block; margin: -7rpx 28rpx 22rpx; color: #76849b; font-size: 25rpx; line-height: 38rpx; }
.response-form-card--evidence :deep(.evidence-gallery) { padding-top: 0; padding-right: 28rpx; padding-left: 28rpx; box-shadow: none; }
.dispute-response-page__bottom-space { height: 26rpx; }
.response-missing { display: flex; flex: 1; align-items: center; justify-content: center; color: #8290a4; font-size: 28rpx; }
.response-footer { position: fixed; right: 0; bottom: 0; left: 0; box-sizing: border-box; padding: 14rpx 32rpx calc(17rpx + env(safe-area-inset-bottom)); background: rgba(255, 255, 255, 0.98); box-shadow: 0 -8rpx 22rpx rgba(33, 69, 111, 0.06); }
.response-footer__button { display: flex; min-height: 84rpx; align-items: center; justify-content: center; border-radius: 999rpx; color: #ffffff; background: linear-gradient(105deg, #6397f5, #3e68ea); font-size: 33rpx; font-weight: 650; }
.response-footer__button--saving { opacity: 0.68; }

@media screen and (max-width: 360px) {
	.response-form-card { margin-right: 16rpx; margin-left: 16rpx; padding: 22rpx; }
	.response-form-card--evidence { padding: 22rpx 0 0; }
	.response-form-card__title { font-size: 31rpx; }
	.response-type-option { font-size: 27rpx; }
	.response-form-card--evidence :deep(.evidence-gallery) { padding-right: 22rpx; padding-left: 22rpx; }
}
</style>
