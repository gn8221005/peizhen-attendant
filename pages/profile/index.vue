<script setup lang="ts">
import AppNavigationBar from '@/components/AppNavigationBar.vue'
import { computed, shallowRef } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import AppBottomNav from '@/components/AppBottomNav.vue'
import { usePrototypeSession } from '@/composables/usePrototypeSession'

type PreviewMode = 'logged-in' | 'logged-out' | ''
type ProfileEntry = 'account' | 'feedback' | 'application' | 'agreement' | 'disputes' | 'violations'

const { loggedIn, refreshSession } = usePrototypeSession()
const previewMode = shallowRef<PreviewMode>('')

const showLoggedIn = computed(() => {
  if (previewMode.value === 'logged-in') return true
  if (previewMode.value === 'logged-out') return false
  return loggedIn.value
})

const entries: Array<{ key: ProfileEntry; label: string; icon?: string; glyph?: string }> = [
	{ key: 'account', label: '我的账户', icon: '/static/images/profile-account.png' },
	{ key: 'feedback', label: '建议与反馈', icon: '/static/images/profile-feedback.png' },
	{ key: 'application', label: '申请入驻', icon: '/static/images/profile-application.png' },
	{ key: 'agreement', label: '服务协议', icon: '/static/images/profile-agreement.png' },
	{ key: 'disputes', label: '争议处理' },
	{ key: 'violations', label: '违约记录' }
]

onLoad((options) => {
  if (options?.preview === 'logged-in' || options?.preview === 'logged-out') {
    previewMode.value = options.preview
  }
})

onShow(() => {
  if (!previewMode.value) refreshSession()
})

function openLogin() {
  uni.navigateTo({ url: '/pages/login/index' })
}

function openEntry(entry: ProfileEntry) {
  if (!showLoggedIn.value && entry !== 'agreement') {
    openLogin()
    return
  }

  if (entry === 'agreement') {
    uni.showToast({ title: '服务协议原型暂未提供', icon: 'none' })
    return
  }

  const paths: Record<Exclude<ProfileEntry, 'agreement'>, string> = {
    account: '/pages/account/index',
    feedback: '/pages/feedback/index',
    application: '/pages/application/index',
    disputes: '/pages/disputes/index',
    violations: '/pages/violation-records/index'
  }
  uni.navigateTo({ url: paths[entry] })
}

function editProfile() {
  uni.showToast({ title: '个人资料原型暂未提供', icon: 'none' })
}
</script>

<template>
  <view class="profile-page">
    <AppNavigationBar title="我的" :show-back="false" />

    <scroll-view class="profile-page__scroll" scroll-y>
      <view class="profile-header">
        <image
          class="profile-avatar"
          :src="showLoggedIn ? '/static/images/profile-avatar.png' : '/static/images/profile-avatar-default.png'"
          mode="aspectFit"
          aria-hidden="true"
        />

        <view v-if="showLoggedIn" class="profile-user">
          <text class="profile-user__greeting">下午好，用户3288</text>
          <text class="profile-user__phone">15979306481</text>
        </view>
        <view v-else class="profile-user profile-user--logged-out">
          <view class="profile-login-button" role="button" aria-label="登录或注册" @tap="openLogin">
            <text>登录/注册</text>
          </view>
          <text class="profile-user__prompt">登录享更多功能</text>
        </view>

        <view v-if="showLoggedIn" class="profile-edit" role="button" aria-label="编辑资料" @tap="editProfile">
          <text>编辑资料</text>
        </view>
      </view>

      <view class="profile-service-card">
        <view class="profile-service-card__heading">
          <view class="profile-service-card__mark" aria-hidden="true"><view /><view /><view /><view /></view>
          <text>服务中心</text>
        </view>
			<view class="profile-entry-list">
          <view
            v-for="entry in entries"
            :key="entry.key"
            class="profile-entry"
            role="button"
            :aria-label="entry.label"
            @tap="openEntry(entry.key)"
          >
				<image v-if="entry.icon" class="profile-entry__icon" :src="entry.icon" mode="aspectFit" aria-hidden="true" />
				<view v-else class="profile-entry__illustration" :class="`profile-entry__illustration--${entry.key}`" aria-hidden="true">
					<view class="profile-entry__illustration-sheet"><view /><view /><view /></view>
					<view class="profile-entry__illustration-mark"><view /></view>
					<view v-if="entry.key === 'disputes'" class="profile-entry__illustration-badge" />
				</view>
            <text class="profile-entry__label">{{ entry.label }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <AppBottomNav active="profile" />
  </view>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100vh;
  height: 100dvh;
  min-height: 0;

  padding-bottom: calc(112rpx + env(safe-area-inset-bottom));
  overflow: hidden;
  background: #f0eff4;
}

.profile-page__scroll {
  flex: 1;
  min-height: 0;
  width: 100%;
}

.profile-header {
  display: flex;
  box-sizing: border-box;
  min-height: 320rpx;
  align-items: center;
  margin: 24rpx 24rpx 18rpx;
  padding: 42rpx 34rpx;
  border-radius: 32rpx;
  background: linear-gradient(130deg, #48bec1 0%, #73d0ce 100%);
  box-shadow: 0 12rpx 24rpx rgba(58, 167, 169, 0.15);
}

.profile-avatar {
  display: block;
  flex: 0 0 166rpx;
  width: 166rpx;
  height: 166rpx;
}

.profile-user {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  margin-left: 24rpx;
  color: #ffffff;
}

.profile-user__greeting {
  font-size: 32rpx;
  font-weight: 700;
  line-height: 46rpx;
  overflow-wrap: anywhere;
}

.profile-user__phone {
  margin-top: 10rpx;
  font-size: 28rpx;
  line-height: 42rpx;
}

.profile-user--logged-out {
  align-items: flex-start;
}

.profile-login-button {
  display: flex;
  min-width: 210rpx;
  min-height: 70rpx;
  align-items: center;
  justify-content: center;
  padding: 0 24rpx;
  border-radius: 999rpx;
  color: #ffffff;
  background: #5379ed;
  font-size: 30rpx;
}

.profile-user__prompt {
  margin-top: 16rpx;
  color: rgba(255, 255, 255, 0.92);
  font-size: 27rpx;
  line-height: 40rpx;
}

.profile-edit {
  display: flex;
  flex: 0 0 auto;
  min-height: 62rpx;
  align-items: center;
  margin-left: 10rpx;
  padding: 0 18rpx;
  border-radius: 999rpx;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.22);
  font-size: 25rpx;
}

.profile-service-card {
  box-sizing: border-box;
  margin: 28rpx 24rpx 36rpx;
  padding: 28rpx 24rpx 30rpx;
  border: 1rpx solid #f0f1f4;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 10rpx 28rpx rgba(31, 49, 78, 0.05);
}

.profile-service-card__heading {
  display: flex;
  align-items: center;
  color: #262a32;
  font-size: 34rpx;
  font-weight: 700;
  line-height: 48rpx;
}

.profile-service-card__mark {
  display: grid;
  width: 42rpx;
  height: 42rpx;
  grid-template-columns: repeat(2, 1fr);
  gap: 5rpx;
  margin-right: 16rpx;
}

.profile-service-card__mark > view {
  border-radius: 9rpx;
  background: #13b3a9;
}

.profile-entry-list {
	display: flex;
	flex-wrap: wrap;
	margin-top: 30rpx;
}

.profile-entry {
	display: flex;
	box-sizing: border-box;
	flex: 0 0 25%;
	width: 25%;
	min-width: 0;
	flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
	min-height: 176rpx;
	border-radius: 18rpx;
}

.profile-entry__icon {
	display: block;
	width: 112rpx;
	height: 112rpx;
}

.profile-entry__illustration {
	position: relative;
	display: flex;
	box-sizing: border-box;
	width: 112rpx;
	height: 112rpx;
	align-items: center;
	justify-content: center;
	margin: 0;
}

.profile-entry__illustration-sheet {
	position: absolute;
	top: 9rpx;
	left: 12rpx;
	box-sizing: border-box;
	width: 76rpx;
	height: 86rpx;
	padding: 15rpx 11rpx;
	border-radius: 15rpx 15rpx 12rpx 12rpx;
	background: #f15f64;
	box-shadow: 0 8rpx 15rpx rgba(221, 83, 83, 0.18);
}

.profile-entry__illustration-sheet > view {
	width: 47rpx;
	height: 6rpx;
	margin-top: 8rpx;
	border-radius: 99rpx;
	background: rgba(255, 255, 255, 0.96);
}

.profile-entry__illustration-sheet > view:first-child { margin-top: 0; }
.profile-entry__illustration-sheet > view:nth-child(2) { width: 39rpx; }
.profile-entry__illustration-sheet > view:nth-child(3) { width: 28rpx; }

.profile-entry__illustration-mark {
	position: absolute;
	left: 62rpx;
	bottom: 13rpx;
	width: 43rpx;
	height: 43rpx;
	border: 5rpx solid #ffffff;
	border-radius: 50%;
	background: #3989f5;
	box-shadow: 0 4rpx 8rpx rgba(34, 85, 161, 0.18);
}

.profile-entry__illustration-mark > view {
	position: absolute;
	top: 13rpx;
	left: 6rpx;
	width: 22rpx;
	height: 8rpx;
	border-radius: 99rpx;
	background: #ffffff;
	transform: rotate(-42deg);
}

.profile-entry__illustration--disputes .profile-entry__illustration-mark::before {
	position: absolute;
	top: -8rpx;
	left: 5rpx;
	width: 23rpx;
	height: 15rpx;
	border: 3rpx solid #ffffff;
	border-radius: 6rpx;
	background: #ffb046;
	content: '';
	transform: rotate(45deg);
}

.profile-entry__illustration--disputes .profile-entry__illustration-mark { border-radius: 7rpx; background: #f5a13a; transform: rotate(-43deg); }
.profile-entry__illustration--disputes .profile-entry__illustration-mark > view { display: none; }

.profile-entry__illustration--violations .profile-entry__illustration-sheet { background: #438bf1; }
.profile-entry__illustration--violations .profile-entry__illustration-mark { background: #276fea; }
.profile-entry__illustration--violations .profile-entry__illustration-mark > view {
	top: 8rpx;
	left: 8rpx;
	width: 17rpx;
	height: 17rpx;
	border: 3rpx solid #ffffff;
	border-radius: 50%;
	background: transparent;
}
.profile-entry__illustration--violations .profile-entry__illustration-mark > view::before,
.profile-entry__illustration--violations .profile-entry__illustration-mark > view::after {
	position: absolute;
	left: 5rpx;
	width: 3rpx;
	border-radius: 99rpx;
	background: #ffffff;
	content: '';
}

.profile-entry__illustration--violations .profile-entry__illustration-mark > view::before { top: 3rpx; height: 6rpx; }
.profile-entry__illustration--violations .profile-entry__illustration-mark > view::after { top: 9rpx; left: 5rpx; width: 7rpx; height: 3rpx; transform: rotate(-35deg); }

.profile-entry__illustration-badge {
	position: absolute;
	top: 8rpx;
	right: 2rpx;
	width: 19rpx;
	height: 19rpx;
	border: 4rpx solid #ffffff;
	border-radius: 50%;
	background: #ef4444;
}

.profile-entry__label {
  max-width: 100%;
  color: #2c3038;
  font-size: 25rpx;
  line-height: 36rpx;
  text-align: center;
  white-space: nowrap;
}

@media screen and (max-width: 360px) {
  .profile-header { padding-right: 18rpx; padding-left: 18rpx; }
  .profile-avatar { flex-basis: 142rpx; width: 142rpx; height: 142rpx; }
  .profile-user { margin-left: 16rpx; }
  .profile-user__greeting { font-size: 28rpx; }
  .profile-edit { padding: 0 12rpx; font-size: 22rpx; }
  .profile-service-card { margin-right: 14rpx; margin-left: 14rpx; padding-right: 12rpx; padding-left: 12rpx; }
	.profile-entry__label { font-size: 22rpx; }
}
</style>
