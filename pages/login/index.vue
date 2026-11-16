<script setup lang="ts">
import AppNavigationBar from '@/components/AppNavigationBar.vue'
import { shallowRef } from 'vue'
import { usePrototypeSession } from '@/composables/usePrototypeSession'

const { signIn } = usePrototypeSession()
const agreementChecked = shallowRef(false)

function toggleAgreement() {
  agreementChecked.value = !agreementChecked.value
}

function openAgreement(title: string) {
  uni.showModal({
    title,
    content: '感谢您阅读相关服务条款。',
    showCancel: false
  })
}

function login() {
  if (!agreementChecked.value) {
    uni.showToast({ title: '请先阅读并同意服务协议', icon: 'none' })
    return
  }

  signIn()
  uni.showToast({ title: '登录成功', icon: 'success', duration: 500 })
  setTimeout(() => {
    uni.reLaunch({ url: '/pages/index/index' })
  }, 500)
}
</script>

<template>
  <view class="login-page">
    <AppNavigationBar title="登录" :show-back="true" />

    <view class="login-content">
      <view class="login-brand">
        <image class="login-brand__symbol" src="/static/images/login-brand-symbol.png" mode="aspectFit" aria-hidden="true" />
        <view class="login-brand__copy">
          <text class="login-brand__name">陪诊无忧</text>
          <text class="login-brand__english">PEI ZHEN WU YOU</text>
        </view>
      </view>

      <text class="login-tagline">如亲友相伴，让看病不再孤单！</text>

      <view class="login-action" role="button" aria-label="微信授权登录" @tap="login">
        <text>微信授权登录</text>
      </view>

      <view class="login-agreement-row">
        <view
          class="login-checkbox"
          :class="{ 'login-checkbox--checked': agreementChecked }"
          role="checkbox"
          :aria-checked="agreementChecked"
          aria-label="同意服务协议与隐私协议"
          @tap="toggleAgreement"
        >
          <view v-if="agreementChecked" class="login-checkbox__check" />
        </view>
        <text class="login-agreement-row__text">我已阅读并同意</text>
        <text class="login-agreement-row__link" role="button" @tap="openAgreement('服务协议')">《服务协议》</text>
        <text class="login-agreement-row__link" role="button" @tap="openAgreement('隐私协议')">《隐私协议》</text>
      </view>

      <text class="login-footnote">登录即表示同意相关服务条款</text>
    </view>
  </view>
</template>

<style scoped>
.login-page {
  display: flex;
  box-sizing: border-box;
  height: 100vh;
  height: 100dvh;
  flex-direction: column;

  overflow-y: auto;
  background: #ffffff;
}

.login-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 210rpx 52rpx 48rpx;
}

.login-brand {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-brand__symbol {
  display: block;
  width: 196rpx;
  height: 166rpx;
  margin-right: 22rpx;
}

.login-brand__copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #315b7c;
}

.login-brand__name {
  font-size: 48rpx;
  font-weight: 700;
  letter-spacing: 3rpx;
  line-height: 68rpx;
  white-space: nowrap;
}

.login-brand__english {
  margin-top: 4rpx;
  color: #7698b1;
  font-size: 20rpx;
  letter-spacing: 3rpx;
  line-height: 30rpx;
  white-space: nowrap;
}

.login-tagline {
  margin-top: 64rpx;
  color: #303238;
  font-size: 31rpx;
  line-height: 48rpx;
  text-align: center;
}

.login-action {
  display: flex;
  width: 100%;
  min-height: 98rpx;
  align-items: center;
  justify-content: center;
  margin-top: 104rpx;
  border-radius: 999rpx;
  color: #ffffff;
  background: linear-gradient(100deg, #5eabf3, #79bcf4);
  box-shadow: 0 12rpx 28rpx rgba(68, 148, 223, 0.13);
  font-size: 34rpx;
  font-weight: 700;
}

.login-agreement-row {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-top: 54rpx;
  color: #666c75;
  font-size: 24rpx;
  line-height: 40rpx;
}

.login-checkbox {
  display: flex;
  flex: 0 0 38rpx;
  width: 38rpx;
  height: 38rpx;
  align-items: center;
  justify-content: center;
  margin-right: 4rpx;
  border: 3rpx solid #d1d3d7;
  border-radius: 50%;
}

.login-checkbox--checked {
  border-color: #59a6ef;
  background: #59a6ef;
}

.login-checkbox__check {
  width: 16rpx;
  height: 9rpx;
  border-bottom: 4rpx solid #ffffff;
  border-left: 4rpx solid #ffffff;
  transform: translateY(-2rpx) rotate(-45deg);
}

.login-agreement-row__link {
  color: #5c9ee5;
}

.login-footnote {
  margin-top: 44rpx;
  color: #92969d;
  font-size: 25rpx;
  line-height: 38rpx;
}

@media screen and (max-width: 360px) {
  .login-content { padding: 160rpx 32rpx 34rpx; }
  .login-brand__symbol { transform: scale(.88); transform-origin: center right; margin-right: 10rpx; }
  .login-brand__name { font-size: 41rpx; }
  .login-tagline { font-size: 28rpx; }
  .login-agreement-row { gap: 4rpx; font-size: 22rpx; }
}

@media screen and (max-height: 700px) {
  .login-content { padding-top: 88rpx; padding-bottom: 26rpx; }
  .login-tagline { margin-top: 40rpx; }
  .login-action { margin-top: 62rpx; }
  .login-agreement-row { margin-top: 34rpx; }
  .login-footnote { margin-top: 24rpx; }
}
</style>
