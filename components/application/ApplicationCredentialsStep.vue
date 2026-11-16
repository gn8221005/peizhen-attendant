<script setup lang="ts">
import ApplicationImageUpload from './ApplicationImageUpload.vue'

const idCard = defineModel<string>('idCard', { default: '' })
const identityFront = defineModel<string>('identityFront', { default: '' })
const identityBack = defineModel<string>('identityBack', { default: '' })
const attendantCertificate = defineModel<string>('attendantCertificate', { default: '' })
const otherCertificate = defineModel<string>('otherCertificate', { default: '' })
</script>

<template>
  <view class="application-step-card application-credentials">
    <text class="application-step-card__title">资质证书</text>

    <view class="application-credential-row application-credential-row--id">
      <text class="application-field__label"><text class="application-field__required">*</text>身份证号</text>
      <input
        v-model="idCard"
        class="application-input"
        maxlength="18"
        placeholder="请输入身份证号"
        aria-label="身份证号"
      />
    </view>

    <view class="application-credential-row application-credential-row--identity">
      <text class="application-field__label"><text class="application-field__required">*</text>身份证照片</text>
      <view class="application-credential-row__uploads">
        <view class="application-credential-row__upload-slot">
          <ApplicationImageUpload
            v-model="identityFront"
            label="点击上传身份证正面"
            placeholder="/static/images/application-upload-id-front.png"
            size="compact"
          />
        </view>
        <view class="application-credential-row__upload-slot">
          <ApplicationImageUpload
            v-model="identityBack"
            label="点击上传身份证反面"
            placeholder="/static/images/application-upload-id-back.png"
            size="compact"
          />
        </view>
      </view>
    </view>

    <view class="application-credential-row application-credential-row--certificate">
      <text class="application-field__label">陪诊师证书</text>
      <ApplicationImageUpload
        v-model="attendantCertificate"
        label="点击上传陪诊师证书"
        placeholder="/static/images/application-upload-document.png"
        size="certificate"
      />
    </view>

    <view class="application-credential-row application-credential-row--certificate application-credential-row--last">
      <text class="application-field__label">其它证书</text>
      <ApplicationImageUpload
        v-model="otherCertificate"
        label="点击上传其它证书"
        placeholder="/static/images/application-upload-document.png"
        size="certificate"
      />
    </view>
  </view>
</template>

<style scoped>
.application-step-card {
  box-sizing: border-box;
  margin: 20rpx 24rpx 30rpx;
  padding: 28rpx 26rpx 10rpx;
  border: 1rpx solid #dcebf9;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 10rpx 26rpx rgba(65, 125, 185, 0.06);
}

.application-step-card__title {
  display: block;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #e9eef4;
  color: #17233a;
  font-size: 36rpx;
  font-weight: 700;
  line-height: 50rpx;
}

.application-credential-row {
  display: flex;
  box-sizing: border-box;
  align-items: center;
  gap: 18rpx;
  padding: 18rpx 0;
  border-bottom: 1rpx solid #edf1f5;
}

.application-credential-row--id { min-height: 124rpx; }
.application-credential-row--identity { align-items: flex-start; padding: 20rpx 0; }
.application-credential-row--certificate { align-items: flex-start; min-height: 228rpx; padding: 20rpx 0; }
.application-credential-row--last { border-bottom: 0; }

.application-field__label {
  display: flex;
  flex: 0 0 176rpx;
  align-items: center;
  color: #19243a;
  font-size: 29rpx;
  font-weight: 600;
  line-height: 44rpx;
}

.application-field__required { margin-right: 7rpx; color: #f04e56; font-size: 34rpx; }

.application-input {
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  height: 88rpx;
  padding: 0 18rpx;
  border-radius: 16rpx;
  color: #1b2944;
  background: #f3f6fa;
  font-size: 31rpx;
}

.application-credential-row__uploads {
  display: flex;
  flex: 1;
  width: 0;
  min-width: 0;
  gap: 20rpx;
}

.application-credential-row__upload-slot {
  flex: 1;
  min-width: 0;
  height: 188rpx;
}

@media screen and (max-width: 360px) {
  .application-step-card { margin-right: 14rpx; margin-left: 14rpx; padding-right: 16rpx; padding-left: 16rpx; }
  .application-credential-row { gap: 10rpx; }
  .application-field__label { flex-basis: 146rpx; font-size: 26rpx; }
  .application-credential-row__uploads { gap: 14rpx; }
  .application-credential-row__upload-slot { height: 170rpx; }
}
</style>
