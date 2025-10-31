'use client'

import type { BrowserConfig } from '@grafana/faro-web-sdk'
import { useFaro } from '../lib'

export default function Instrumentation(config?: BrowserConfig): void {
	useFaro(config)
}
