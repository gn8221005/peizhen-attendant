<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'

onLaunch(() => {
	console.log('App Launch')
})

onShow(() => {
	console.log('App Show')
})

onHide(() => {
	console.log('App Hide')
})
</script>

<style lang="scss">
	@import 'uview-plus/index.scss';

	page {
		--app-page-surface: #f7f9fc;
		--app-page-surface-muted: #f1f4f8;
		--app-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
		background: var(--app-page-surface);
		color: #171a22;
		font-family: var(--app-font-family);
	}

	button::after {
		border: 0;
	}

	button,
	input,
	textarea {
		font-family: var(--app-font-family);
	}

	/* #ifdef H5 */
	uni-page-head .uni-page-head__title {
		font-size: 20px !important;
	}
	/* #endif */

</style>
