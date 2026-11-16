import { shallowRef } from 'vue'

const loggedIn = shallowRef(false)
const certified = shallowRef(false)

function readFlag(key: string) {
	try {
		return uni.getStorageSync(key) === true
	} catch {
		return false
	}
}

function writeFlag(key: string, value: boolean) {
	try {
		uni.setStorageSync(key, value)
	} catch {
		// The static prototype stays usable in environments without storage.
	}
}

export function usePrototypeSession() {
	function refreshSession() {
		loggedIn.value = readFlag('prototype-logged-in')
		certified.value = readFlag('prototype-certified')
	}

	function signIn() {
		loggedIn.value = true
		writeFlag('prototype-logged-in', true)
	}

	function certify() {
		certified.value = true
		writeFlag('prototype-certified', true)
	}

	return {
		loggedIn,
		certified,
		refreshSession,
		signIn,
		certify
	}
}
