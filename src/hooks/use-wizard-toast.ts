import { useContext } from 'react'
import { ToastRefContext } from '@/components/toast-provider'

const wizardSuccess = [
	"✨ Success! The magic is complete!",
	"🧙‍♂️ Your wish has been granted!",
	"🔮 The spell worked perfectly!",
	"🎩 Voila! Your result is ready!",
]

const wizardErrors = [
	"🧙‍♂️ Alas! The magic fizzled. Try again!",
	"⚡ Oops! The spell misfired. Please check your input.",
	"🪄 The wizard is tired. Please try again later!",
	"🚫 The stars aren't aligned. Something went wrong!",
]

function getRandom(arr: string[]) {
	return arr[Math.floor(Math.random() * arr.length)]
}

function playSound(type: 'success' | 'error') {
	const url =
		type === 'success'
			? 'https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5e2.mp3' // magic chime
			: 'https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5e2.mp3' // you can swap for a different error sound
	const audio = new Audio(url)
	audio.volume = 0.4
	audio.play()
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