<script setup lang="ts">
interface Message {
	id: string
	role: 'user' | 'assistant'
	content: string
	status: 'sent' | 'sending' | 'error'
}

const props = withDefaults(defineProps<{
	messages?: readonly Message[]
	loading?: boolean
	sending?: boolean
	error?: string
}>(), { messages: () => [], loading: false, sending: false, error: '' })

const emit = defineEmits<{ suggestion: [content: string]; retry: [messageId: string]; reload: [] }>()
</script>

<template>
	<scroll-view class="message-scroll" scroll-y :show-scrollbar="false">
		<view v-if="props.loading" class="state-panel" aria-label="正在加载历史消息">
			<view class="state-spinner" aria-hidden="true" />
			<text class="state-text">正在加载会话...</text>
		</view>
		<view v-else-if="props.error" class="state-panel state-panel--error">
			<view class="state-icon" aria-hidden="true">!</view>
			<text class="state-title">消息加载失败</text>
			<text class="state-text">{{ props.error }}</text>
			<button class="state-button" hover-class="state-button--pressed" @tap="emit('reload')">重新加载</button>
		</view>
		<view v-else-if="!props.messages.length" class="welcome">
			<view class="assistant-avatar">
				<image class="assistant-avatar__image" src="/static/images/assistant-mascot.png" mode="aspectFill" />
			</view>
			<text class="welcome-title">你好，我是陪诊小助手</text>
			<text class="welcome-description">可以帮你梳理接单准备、服务流程与沟通要点。选择一个问题，或直接告诉我你遇到的情况。</text>
			<view class="suggestion-list" aria-label="推荐问题">
				<button class="suggestion-item" :disabled="props.sending" aria-label="第一次接陪诊订单，需要提前准备什么？" hover-class="suggestion-item--pressed" @tap="emit('suggestion', '第一次接陪诊订单，需要提前准备什么？')">
					<text class="suggestion-item__text">第一次接陪诊订单，需要提前准备什么？</text>
					<view class="suggestion-item__arrow" aria-hidden="true" />
				</button>
				<button class="suggestion-item" :disabled="props.sending" aria-label="如何与患者确认就诊信息？" hover-class="suggestion-item--pressed" @tap="emit('suggestion', '如何与患者确认就诊信息？')">
					<text class="suggestion-item__text">如何与患者确认就诊信息？</text>
					<view class="suggestion-item__arrow" aria-hidden="true" />
				</button>
				<button class="suggestion-item" :disabled="props.sending" aria-label="陪诊过程中有哪些沟通注意事项？" hover-class="suggestion-item--pressed" @tap="emit('suggestion', '陪诊过程中有哪些沟通注意事项？')">
					<text class="suggestion-item__text">陪诊过程中有哪些沟通注意事项？</text>
					<view class="suggestion-item__arrow" aria-hidden="true" />
				</button>
			</view>
		</view>
		<view v-else class="message-list" aria-label="聊天消息">
			<view v-for="message in props.messages" :key="message.id" class="message-row" :class="`message-row--${message.role}`">
				<view v-if="message.role === 'assistant'" class="message-avatar">
					<image class="assistant-avatar__image" src="/static/images/assistant-avatar.png" mode="aspectFill" />
				</view>
				<view class="message-content">
					<view class="message-bubble" :class="[`message-bubble--${message.role}`, { 'typing-bubble': message.role === 'assistant' && message.status === 'sending' && !message.content }]" :aria-label="message.role === 'assistant' && message.status === 'sending' && !message.content ? '小助手正在思考' : undefined">
						<text v-if="message.content" class="message-text" selectable user-select>{{ message.content }}</text>
						<template v-else-if="message.role === 'assistant' && message.status === 'sending'"><view class="typing-dot" /><view class="typing-dot" /><view class="typing-dot" /></template>
					</view>
					<button v-if="message.status === 'error'" class="retry-button" hover-class="retry-button--pressed" @tap="emit('retry', message.id)">发送失败，点击重试</button>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<style scoped>
.message-scroll { box-sizing: border-box; width: 100%; height: 100%; }
.welcome { display: flex; box-sizing: border-box; min-height: 100%; flex-direction: column; align-items: center; padding: 84rpx 40rpx 40rpx; }
.assistant-avatar { width: 128rpx; height: 128rpx; flex-shrink: 0; overflow: hidden; border: 2rpx solid rgba(22, 119, 255, .12); border-radius: 34rpx; background: #fff; box-shadow: 0 14rpx 36rpx rgba(31, 96, 162, .16); }
.assistant-avatar__image { width: 100%; height: 100%; }
.welcome-title { margin-top: 28rpx; color: #172b4d; font-size: 38rpx; font-weight: 600; line-height: 1.4; }
.welcome-description { max-width: 620rpx; margin-top: 16rpx; color: #5b6b7f; font-size: 28rpx; line-height: 1.65; text-align: center; }
.suggestion-list { display: flex; width: 100%; max-width: 650rpx; flex-direction: column; gap: 20rpx; margin-top: 48rpx; }
.suggestion-item { display: flex; box-sizing: border-box; width: 100%; min-height: 96rpx; align-items: center; justify-content: space-between; gap: 20rpx; margin: 0; padding: 22rpx 26rpx; border: 2rpx solid #e3ebf5; border-radius: 20rpx; background: #fff; box-shadow: 0 6rpx 22rpx rgba(23, 43, 77, .05); line-height: 1.5; text-align: left; transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease, background-color .2s ease; }
.suggestion-item--pressed { background: #f0f7ff; transform: scale(.99); }
.suggestion-item[disabled] { opacity: .55; }
@media (hover: hover) {
	.suggestion-item:not([disabled]):hover { border-color: #b9d5fa; box-shadow: 0 14rpx 30rpx rgba(41, 94, 160, .13); transform: translateY(-4rpx); }
}
.suggestion-item__text { flex: 1; color: #26384d; font-size: 28rpx; line-height: 1.5; }
.suggestion-item__arrow { box-sizing: border-box; width: 15rpx; height: 15rpx; flex: 0 0 15rpx; border-top: 3rpx solid #7c8da0; border-right: 3rpx solid #7c8da0; transform: rotate(45deg); }
.suggestion-item::after, .state-button::after, .retry-button::after { border: 0; }
.state-panel { display: flex; min-height: 360rpx; flex-direction: column; align-items: center; justify-content: center; gap: 20rpx; }
.state-panel--error { padding: 40rpx; text-align: center; }
.state-text { color: #596778; font-size: 28rpx; }
.state-title { color: #26384d; font-size: 30rpx; font-weight: 600; }
.state-icon { display: flex; width: 88rpx; height: 88rpx; align-items: center; justify-content: center; border-radius: 28rpx; color: #d92d20; background: #fff0ef; font-size: 40rpx; font-weight: 600; }
.state-spinner { box-sizing: border-box; width: 44rpx; height: 44rpx; border: 4rpx solid #d7e7fb; border-top-color: #1677ff; border-radius: 50%; animation: spin .8s linear infinite; }
.state-button { min-width: 184rpx; min-height: 80rpx; margin: 12rpx 0 0; padding: 0 28rpx; border: 2rpx solid #b9d6fb; border-radius: 20rpx; color: #1268d6; background: #edf6ff; font-size: 27rpx; line-height: 80rpx; }
.state-button--pressed { background: #dfedff; }
.message-list { padding: 28rpx 28rpx 8rpx; }
.message-row { display: flex; box-sizing: border-box; width: 100%; align-items: flex-start; gap: 16rpx; margin-bottom: 30rpx; }
.message-row--user { justify-content: flex-end; }
.message-avatar { box-sizing: border-box; width: 64rpx; height: 64rpx; flex-shrink: 0; overflow: hidden; border: 2rpx solid rgba(22, 119, 255, .12); border-radius: 18rpx; background: #fff; box-shadow: 0 6rpx 16rpx rgba(31, 96, 162, .1); }
.message-content { display: flex; max-width: 78%; flex-direction: column; align-items: flex-start; }
.message-row--user .message-content { align-items: flex-end; }
.message-bubble { box-sizing: border-box; max-width: 100%; padding: 22rpx 26rpx; border-radius: 10rpx 28rpx 28rpx 28rpx; }
.message-bubble--assistant { border: 2rpx solid #e8eef5; color: #26384d; background: #fff; box-shadow: 0 6rpx 22rpx rgba(23, 43, 77, .05); }
.message-bubble--user { border-radius: 28rpx 10rpx 28rpx 28rpx; color: #fff; background: linear-gradient(135deg, #1677ff, #0b62d6); box-shadow: 0 8rpx 24rpx rgba(22, 119, 255, .2); }
.message-text { font-size: 30rpx; line-height: 1.65; overflow-wrap: anywhere; white-space: pre-wrap; }
.retry-button { min-height: 64rpx; margin: 6rpx 0 0; padding: 0 10rpx; color: #d92d20; background: transparent; font-size: 24rpx; line-height: 64rpx; }
.retry-button--pressed { opacity: .65; }
.typing-bubble { display: flex; min-width: 112rpx; min-height: 72rpx; align-items: center; justify-content: center; gap: 10rpx; }
.typing-dot { width: 12rpx; height: 12rpx; border-radius: 50%; background: #8da2b8; animation: typing 1.2s ease-in-out infinite; }
.typing-dot:nth-child(2) { animation-delay: .16s; }
.typing-dot:nth-child(3) { animation-delay: .32s; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes typing { 0%, 60%, 100% { opacity: .35; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-6rpx); } }
@media (prefers-reduced-motion: reduce) { .state-spinner, .typing-dot { animation: none; } .suggestion-item { transition: none; } .suggestion-item--pressed, .suggestion-item:not([disabled]):hover { transform: none; } }
</style>
