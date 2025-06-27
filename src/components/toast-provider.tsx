'use client'

import { createContext, useRef, RefObject } from 'react'
import { Toast } from 'primereact/toast'

export const ToastRefContext = createContext<RefObject<Toast | null> | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const toastRef = useRef<Toast | null>(null)
	return (
		<ToastRefContext.Provider value={toastRef}>
			<Toast ref={toastRef} position="top-center" />
			{children}
		</ToastRefContext.Provider>
	)
} 