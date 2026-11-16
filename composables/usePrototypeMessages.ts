import { computed, shallowRef } from 'vue'
import { prototypeMessages, type MessageCategory, type PrototypeMessage } from '@/data/prototypeMessages'

// Only demo read state is stored locally; no real message service is connected.
const STORAGE_KEY = 'prototype-message-read-state-v1'
const messages = shallowRef<PrototypeMessage[]>(prototypeMessages.map((message) => ({ ...message })))
const unreadCount = computed(() => messages.value.filter((message) => !message.read).length)
const unreadByCategory = computed<Record<MessageCategory, number>>(() => {
	const counts: Record<MessageCategory, number> = { order: 0, account: 0, platform: 0 }
	for (const message of messages.value) {
		if (!message.read) counts[message.category]++
	}
	return counts
})
let initialized = false
let storageDirty = false

function persist() {
	if (typeof uni === 'undefined') return
	try {
		const readState = Object.fromEntries(messages.value.map((message) => [message.id, message.read]))
		uni.setStorageSync(STORAGE_KEY, JSON.stringify(readState))
		storageDirty = false
	} catch {
		// Keep the in-memory demo usable when storage is unavailable.
	}
}

function refresh() {
	// Do not replace newer in-memory changes with an older copy after a failed write.
	if (storageDirty) {
		persist()
		initialized = true
		return
	}
	if (typeof uni !== 'undefined') {
		try {
			const stored = uni.getStorageSync(STORAGE_KEY)
			if (typeof stored === 'string' && stored.trim()) {
				const parsed: unknown = JSON.parse(stored)
				if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
					const readState = parsed as Record<string, unknown>
					messages.value = prototypeMessages.map((message) => ({
						...message,
						read: typeof readState[message.id] === 'boolean' ? readState[message.id] as boolean : message.read
					}))
				}
			}
		} catch {
			// Retain the current in-memory state when storage cannot be read.
		}
	}
	initialized = true
}

function markRead(id: string) {
	if (!messages.value.some((message) => message.id === id && !message.read)) return
	messages.value = messages.value.map((message) => message.id === id ? { ...message, read: true } : message)
	storageDirty = true
	persist()
}

function markAllRead() {
	if (!unreadCount.value) return
	messages.value = messages.value.map((message) => ({ ...message, read: true }))
	storageDirty = true
	persist()
}

export function usePrototypeMessages() {
	if (!initialized) refresh()
	return { messages, unreadCount, unreadByCategory, markRead, markAllRead, refresh }
}
