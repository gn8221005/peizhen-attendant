<script setup lang="ts">
import AppNavigationBar from '@/components/AppNavigationBar.vue'
import { computed, reactive, shallowRef } from 'vue'

const feedbackForm = reactive({
  contact: '',
  content: '',
})
const feedbackType = shallowRef('')
const feedbackTypes = ['功能建议', '服务体验', '问题反馈', '其他']
const contentCount = computed(() => feedbackForm.content.length)

function selectFeedbackType() {
  uni.showActionSheet({
    itemList: feedbackTypes,
    success: ({ tapIndex }) => {
      feedbackType.value = feedbackTypes[tapIndex]
    },
  })
}

function addImage() {
  uni.showToast({ title: '图片上传功能演示', icon: 'none' })
}

function submitFeedback() {
  if (!feedbackType.value) {
    uni.showToast({ title: '请选择反馈类型', icon: 'none' })
    return
  }
  if (!feedbackForm.content.trim()) {
    uni.showToast({ title: '请填写反馈内容', icon: 'none' })
    return
  }

  uni.showToast({ title: '反馈已提交，感谢您的建议', icon: 'none' })
}
</script>

<template>
  <view class="feedback-page">
    <AppNavigationBar title="建议与反馈" :show-back="true" />

    <scroll-view class="feedback-page__scroll" scroll-y>
      <view class="feedback-page__canvas">
        <view class="feedback-hero" aria-hidden="true">
          <image class="feedback-hero__background" src="/static/images/feedback-hero-background.png" mode="aspectFill" />
        </view>

        <view class="feedback-page__content">
          <view class="feedback-card feedback-card--type">
            <text class="feedback-card__title">反馈类型 <text class="feedback-required">*</text></text>
            <view class="feedback-type-picker" role="button" aria-label="选择反馈类型" @tap="selectFeedbackType">
              <text :class="{ 'feedback-type-picker__value': feedbackType }">{{ feedbackType || '请选择反馈类型' }}</text>
              <text class="feedback-type-picker__arrow" aria-hidden="true">›</text>
            </view>
          </view>

          <view class="feedback-card feedback-card--contact">
            <text class="feedback-card__title">联系方式 <text class="feedback-card__optional">（可选）</text></text>
            <view class="feedback-contact-field">
              <image class="feedback-contact-field__icon" src="/static/images/feedback-contact-person.png" mode="aspectFit" aria-hidden="true" />
              <input
                v-model="feedbackForm.contact"
                class="feedback-contact-field__input"
                maxlength="30"
                placeholder="请输入您的手机号或微信号"
                aria-label="联系方式"
              />
            </view>
          </view>

          <view class="feedback-card feedback-card--content">
            <text class="feedback-card__title">反馈内容 <text class="feedback-required">*</text></text>
            <view class="feedback-content-field">
              <image class="feedback-content-field__icon" src="/static/images/feedback-content-pencil.png" mode="aspectFit" aria-hidden="true" />
              <textarea
                v-model="feedbackForm.content"
                class="feedback-content-field__input"
                maxlength="500"
                placeholder="请详细描述您的问题或建议，我们会认真对待每一条反馈..."
                aria-label="反馈内容"
              />
              <text class="feedback-content-field__count">{{ contentCount }}/500</text>
            </view>
          </view>

          <view class="feedback-card feedback-card--images">
            <text class="feedback-card__title">上传图片 <text class="feedback-card__optional">（可选）</text></text>
            <view class="feedback-image-upload" role="button" aria-label="上传截图" @tap="addImage">
              <text class="feedback-image-upload__plus" aria-hidden="true">+</text>
              <text>上传截图</text>
              <text class="feedback-image-upload__count">0/6</text>
            </view>
          </view>
          <view class="feedback-page__bottom-space" />
        </view>
      </view>
    </scroll-view>

    <view class="feedback-footer">
      <view class="feedback-submit" role="button" aria-label="提交反馈" @tap="submitFeedback">提交反馈</view>
    </view>
  </view>
</template>

<style scoped>
.feedback-page {
  display: flex;
  box-sizing: border-box;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  flex-direction: column;

  overflow: hidden;
  background: linear-gradient(180deg, #f2f7ff 0%, #f8fbff 44%, #f3f8fe 100%);
}

.feedback-page__scroll { flex: 1; min-height: 0; width: 100%; }
.feedback-page__canvas { position: relative; }
.feedback-page__content { position: relative; z-index: 1; padding-top: 254rpx; }

.feedback-hero {
  position: absolute;
  z-index: 0;
  top: 0;
  right: 0;
  left: 0;
  height: 320rpx;
  overflow: hidden;
  background-color: #edf4ff;
}

.feedback-hero__background { position: absolute; top: 0; left: 0; display: block; width: 100%; height: 100%; }

.feedback-card {
  box-sizing: border-box;
  margin: 18rpx 22rpx;
  padding: 28rpx 28rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 10rpx 28rpx rgba(54, 87, 137, 0.08);
}

.feedback-card--type { margin-top: 18rpx; }
.feedback-card__title { display: block; color: #171f30; font-size: 32rpx; font-weight: 600; line-height: 46rpx; }
.feedback-required { color: #ef5158; }
.feedback-card__optional { color: #171f30; font-weight: 400; }

.feedback-type-picker {
  display: flex;
  box-sizing: border-box;
  min-height: 76rpx;
  align-items: center;
  justify-content: space-between;
  margin-top: 22rpx;
  padding: 0 24rpx;
  border: 1rpx solid #e1e4ea;
  border-radius: 18rpx;
  color: #8c909a;
  background: #ffffff;
  font-size: 29rpx;
}

.feedback-type-picker__value { color: #202a3f; }
.feedback-type-picker__arrow { color: #9298a2; font-size: 46rpx; font-weight: 300; line-height: 1; }
.feedback-card--contact { padding-bottom: 22rpx; }

.feedback-contact-field {
  display: flex;
  min-height: 86rpx;
  align-items: center;
  gap: 18rpx;
  margin-top: 8rpx;
  border-bottom: 1rpx solid #e5e7ec;
}

.feedback-contact-field__icon { display: block; flex: 0 0 auto; width: 56rpx; height: 56rpx; }
.feedback-contact-field__input { flex: 1; min-width: 0; color: #202a3f; font-size: 29rpx; }
.feedback-content-field {
  position: relative;
  box-sizing: border-box;
  min-height: 290rpx;
  margin-top: 22rpx;
  padding: 20rpx 18rpx 52rpx 88rpx;
  border: 1rpx solid #e1e4ea;
  border-radius: 18rpx;
}

.feedback-content-field__icon { position: absolute; top: 19rpx; left: 20rpx; width: 56rpx; height: 56rpx; }
.feedback-content-field__input { display: block; width: 100%; height: 208rpx; color: #202a3f; font-size: 28rpx; line-height: 1.55; }
.feedback-content-field__count { position: absolute; right: 20rpx; bottom: 14rpx; color: #848b98; font-size: 25rpx; }
.feedback-card--images { padding-bottom: 28rpx; }

.feedback-image-upload {
  display: flex;
  box-sizing: border-box;
  width: 184rpx;
  height: 184rpx;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5rpx;
  margin-top: 20rpx;
  border: 2rpx dashed #83a9ff;
  border-radius: 18rpx;
  color: #4b5260;
  font-size: 25rpx;
}

.feedback-image-upload__plus { color: #6a98fa; font-size: 66rpx; font-weight: 300; line-height: 60rpx; }
.feedback-image-upload__count { color: #6592f3; font-size: 24rpx; }
.feedback-page__bottom-space { height: 24rpx; }

.feedback-footer {
  box-sizing: border-box;
  padding: 16rpx 44rpx calc(18rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 -8rpx 24rpx rgba(50, 90, 130, 0.05);
}

.feedback-submit {
  display: flex;
  min-height: 84rpx;
  align-items: center;
  justify-content: center;
  border-radius: 999rpx;
  color: #ffffff;
  background: linear-gradient(105deg, #6397f5 0%, #3e68ea 100%);
  box-shadow: 0 10rpx 22rpx rgba(63, 105, 234, 0.2);
  font-size: 32rpx;
  font-weight: 600;
}

@media screen and (max-width: 360px) {
  .feedback-card { margin-right: 16rpx; margin-left: 16rpx; padding-right: 22rpx; padding-left: 22rpx; }
  .feedback-footer { padding-right: 30rpx; padding-left: 30rpx; }
}

@media screen and (max-height: 700px) {
  .feedback-hero { height: 290rpx; }
  .feedback-card { margin-top: 12rpx; margin-bottom: 12rpx; padding-top: 20rpx; padding-bottom: 20rpx; }
  .feedback-content-field { min-height: 230rpx; }
  .feedback-content-field__input { height: 160rpx; }
  .feedback-image-upload { width: 150rpx; height: 150rpx; }
}
</style>
