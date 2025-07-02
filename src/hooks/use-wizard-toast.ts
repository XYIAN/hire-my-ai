import { useContext } from 'react'
import { ToastRefContext } from '@/components/toast-provider'

// Type declaration for WebKit AudioContext
declare global {
	interface Window {
		webkitAudioContext: typeof AudioContext
	}
}

const wizardSuccess = [
	'✨ Success! The magic is complete!',
	'🧙‍♂️ Your wish has been granted!',
	'🔮 The spell worked perfectly!',
	'🎩 Voila! Your result is ready!',
]

const wizardErrors = [
	'🧙‍♂️ Alas! The magic fizzled. Try again!',
	'⚡ Oops! The spell misfired. Please check your input.',
	'🪄 The wizard is tired. Please try again later!',
	"🚫 The stars aren't aligned. Something went wrong!",
]

function getRandom(arr: string[]) {
	return arr[Math.floor(Math.random() * arr.length)]
}

function playSound(type: 'success' | 'error') {
	try {
		// Create audio context
		const AudioContextClass = window.AudioContext || window.webkitAudioContext
		const audioContext = new AudioContextClass()

		// Create oscillator
		const oscillator = audioContext.createOscillator()
		const gainNode = audioContext.createGain()

		// Connect nodes
		oscillator.connect(gainNode)
		gainNode.connect(audioContext.destination)

		// Set sound properties based on type
		if (type === 'success') {
			// Success sound: ascending chime
			oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
			oscillator.frequency.setValueAtTime(
				659.25,
				audioContext.currentTime + 0.1
			) // E5
			oscillator.frequency.setValueAtTime(
				783.99,
				audioContext.currentTime + 0.2
			) // G5
			oscillator.type = 'sine'
			gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
			gainNode.gain.exponentialRampToValueAtTime(
				0.01,
				audioContext.currentTime + 0.5
			)
		} else {
			// Error sound: descending tone
			oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // A4
			oscillator.frequency.setValueAtTime(415.3, audioContext.currentTime + 0.1) // Ab4
			oscillator.frequency.setValueAtTime(392, audioContext.currentTime + 0.2) // G4
			oscillator.type = 'sawtooth'
			gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
			gainNode.gain.exponentialRampToValueAtTime(
				0.01,
				audioContext.currentTime + 0.4
			)
		}

		// Start and stop
		oscillator.start(audioContext.currentTime)
		oscillator.stop(audioContext.currentTime + (type === 'success' ? 0.5 : 0.4))
	} catch (error) {
		// Silently fail if audio context is not supported
		console.warn('Audio not supported:', error)
	}
}

export function useWizardToast() {
	const toastRef = useContext(ToastRefContext)

	return {
		success: (detail: string) => {
			playSound('success')
			if (toastRef && toastRef.current) {
				toastRef.current.show({
					severity: 'success',
					summary: getRandom(wizardSuccess),
					detail,
					life: 3500,
				})
			}
		},
		error: (detail: string) => {
			playSound('error')
			if (toastRef && toastRef.current) {
				toastRef.current.show({
					severity: 'error',
					summary: getRandom(wizardErrors),
					detail,
					life: 4000,
				})
			}
		},
		info: (detail: string) => {
			if (toastRef && toastRef.current) {
				toastRef.current.show({
					severity: 'info',
					summary: 'Wizard Info',
					detail,
					life: 3000,
				})
			}
		},
	}
}
