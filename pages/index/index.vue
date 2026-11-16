<script setup lang="ts">
import AppNavigationBar from '@/components/AppNavigationBar.vue'
import { computed, shallowRef } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import AppBottomNav from '@/components/AppBottomNav.vue'
import DispatchOrderCard from '@/components/DispatchOrderCard.vue'
import { dispatchOrders } from '@/data/prototypeOrders'
import { usePrototypeSession } from '@/composables/usePrototypeSession'
import { useOrderRecords } from '@/composables/useOrderRecords'

const { certified, refreshSession } = usePrototypeSession()
const { findOrder, refresh: refreshOrdersState } = useOrderRecords()
const previewMode = shallowRef<'certified' | 'uncertified' | ''>('')
const activeDispatchTab = shallowRef<'recommended' | 'others'>('recommended')

const showCertified = computed(() => {
  if (previewMode.value === 'certified') return true
  if (previewMode.value === 'uncertified') return false
  return certified.value
})

const visibleDispatchOrders = computed(() =>
  activeDispatchTab.value === 'recommended' ? dispatchOrders.filter((order) => !findOrder(order.id)) : []
)

onLoad((options) => {
  if (options?.preview === 'certified' || options?.preview === 'uncertified') {
    previewMode.value = options.preview
  }
})

onShow(() => {
  refreshOrdersState()
  if (!previewMode.value) refreshSession()
})

function openApplication() {
  uni.navigateTo({ url: '/pages/application/index' })
}

function openOrder(id: string) {
  uni.navigateTo({ url: `/pages/service/index?dispatchId=${encodeURIComponent(id)}` })
}

function refreshOrders() {
  uni.showToast({ title: '派单信息已刷新', icon: 'none' })
}

function dismissOrder() {
  uni.showToast({ title: '已记录你的选择', icon: 'none' })
}
</script>

<template>
  <view class="home-page">
    <AppNavigationBar title="首页" :show-back="false" />
    <scroll-view class="home-page__scroll" scroll-y>
      <view class="home-page__content">
        <view class="home-hero" aria-label="用专业陪伴，让就医更温暖；关爱、陪伴、专业、安心">
          <image class="home-hero__image" src="/static/images/home-companion-banner.png" mode="aspectFill" aria-hidden="true" />
        </view>

        <view class="home-section-heading">
          <text>派单信息</text>
          <view class="home-refresh" role="button" aria-label="刷新派单信息" @tap="refreshOrders">
            <text class="home-refresh__icon" aria-hidden="true">↻</text>
            <text>刷新</text>
          </view>
        </view>

        <view v-if="showCertified" class="dispatch-tabs" aria-label="派单分类">
          <view
            class="dispatch-tabs__tab"
            :class="{ 'dispatch-tabs__tab--active': activeDispatchTab === 'recommended' }"
            role="tab"
            :aria-selected="activeDispatchTab === 'recommended'"
            @tap="activeDispatchTab = 'recommended'"
          >推荐订单</view>
          <view
            class="dispatch-tabs__tab"
            :class="{ 'dispatch-tabs__tab--active': activeDispatchTab === 'others' }"
            role="tab"
            :aria-selected="activeDispatchTab === 'others'"
            @tap="activeDispatchTab = 'others'"
          >其它订单</view>
        </view>

        <view v-if="showCertified && visibleDispatchOrders.length" class="dispatch-list">
          <DispatchOrderCard
            v-for="order in visibleDispatchOrders"
            :key="order.id"
            :order="order"
            @open="openOrder(order.id)"
            @dismiss="dismissOrder"
          />
        </view>
        <view v-else-if="showCertified" class="home-empty-state">
          <view class="home-empty-state__icon" aria-hidden="true">✓</view>
          <text class="home-empty-state__title">暂无其它派单</text>
          <text class="home-empty-state__description">有新的服务需求时会及时通知你</text>
        </view>
        <view v-else class="certification-card">
          <image class="certification-art" src="/static/images/certification-review.png" mode="aspectFit" aria-hidden="true" />
          <text class="certification-card__title">您还没有通过认证审核</text>
          <text class="certification-card__description">请先完成陪诊师认证，审核通过后即可查看并承接派单信息</text>
          <view class="certification-card__button" role="button" aria-label="去认证" @tap="openApplication">
            <text>去认证</text>
            <text class="certification-card__arrow" aria-hidden="true">›</text>
          </view>
          <text class="certification-card__note">成为专业的陪诊师<br />用爱与专业，陪伴更多有需要的人</text>
        </view>
      </view>
    </scroll-view>

    <AppBottomNav active="home" />
  </view>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100vh;
  height: 100dvh;
  min-height: 0;

  padding-bottom: calc(112rpx + env(safe-area-inset-bottom));
  overflow: hidden;
  background: #f5f9ff;
}

.home-page__scroll {
  flex: 1;
  min-height: 0;
  width: 100%;
}

.home-page__content {
  box-sizing: border-box;
  padding: 22rpx 20rpx 36rpx;
}

.home-hero {
  position: relative;
  display: flex;
  box-sizing: border-box;
  height: 320rpx;
  min-height: 300rpx;
  align-items: center;
  overflow: hidden;
  padding: 24rpx 18rpx;
  border-radius: 28rpx;
  background: #d8eee6;
}

.home-hero__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.home-section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 24rpx 2rpx 16rpx;
  color: #121b2d;
  font-size: 38rpx;
  font-weight: 700;
  line-height: 54rpx;
}

.home-refresh {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #2678ed;
  font-size: 30rpx;
  font-weight: 500;
}

.home-refresh__icon {
  font-size: 42rpx;
  line-height: 1;
}

.dispatch-tabs {
  display: flex;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.dispatch-tabs__tab {
  display: flex;
  min-width: 170rpx;
  height: 58rpx;
  align-items: center;
  justify-content: center;
  padding: 0 20rpx;
  border-radius: 18rpx;
  color: #72809a;
  background: #eaf0f8;
  font-size: 28rpx;
}

.dispatch-tabs__tab--active {
  color: #ffffff;
  background: linear-gradient(100deg, #287fff, #1766e9);
}

.dispatch-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.certification-card,
.home-empty-state {
  display: flex;
  box-sizing: border-box;
  min-height: 700rpx;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx 34rpx;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 8rpx 26rpx rgba(55, 104, 166, 0.06);
  text-align: center;
}

.certification-art {
  display: block;
  width: 420rpx;
  height: 300rpx;
  margin-bottom: 26rpx;
}

.certification-card__title {
  color: #152033;
  font-size: 38rpx;
  font-weight: 700;
  line-height: 54rpx;
}

.certification-card__description {
  margin-top: 16rpx;
  color: #8792a4;
  font-size: 28rpx;
  line-height: 44rpx;
}

.certification-card__button {
  display: flex;
  width: 76%;
  min-height: 88rpx;
  align-items: center;
  justify-content: center;
  gap: 18rpx;
  margin-top: 36rpx;
  border-radius: 999rpx;
  color: #ffffff;
  background: linear-gradient(100deg, #3e81f7, #3170ee);
  font-size: 34rpx;
  font-weight: 600;
}

.certification-card__arrow {
  font-size: 54rpx;
  line-height: 1;
}

.certification-card__note {
  margin-top: 30rpx;
  color: #8994a6;
  font-size: 26rpx;
  line-height: 42rpx;
}

.home-empty-state {
  min-height: 360rpx;
}

.home-empty-state__icon {
  display: flex;
  width: 84rpx;
  height: 84rpx;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #ffffff;
  background: #51bd8a;
  font-size: 48rpx;
  font-weight: 700;
}

.home-empty-state__title {
  margin-top: 20rpx;
  color: #243047;
  font-size: 32rpx;
  font-weight: 600;
}

.home-empty-state__description {
  margin-top: 10rpx;
  color: #8792a4;
  font-size: 26rpx;
}

@media screen and (max-width: 360px) {
  .home-page__content { padding-right: 14rpx; padding-left: 14rpx; }
}
</style>
