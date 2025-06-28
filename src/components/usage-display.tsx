'use client'

import { useEffect, useState } from 'react'
import { storageUtils } from '@/utils/storage'

export function UsageDisplay() {
	const [remaining, setRemaining] = useState(10)

	useEffect(() => {
		const updateUsage = () => {
			setRemaining(storageUtils.getRemainingGenerations())
		}

		updateUsage()
		// Update usage display when window gains focus
		window.addEventListener('focus', updateUsage)
		
		return () => {
			window.removeEventListener('focus', updateUsage)
		}
	}, [])

	return (
		<div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-sm font-medium text-gray-800">
						Daily Usage
					</h3>
					<p className="text-xs text-gray-600">
						{remaining} generations remaining today
					</p>
				</div>
				<div className="text-right">
					<div className="text-lg font-bold text-gray-800">
						{remaining}/10
					</div>
					<div className="text-xs text-gray-600">
						Resets daily
					</div>
				</div>
			</div>
		</div>
	)
} 