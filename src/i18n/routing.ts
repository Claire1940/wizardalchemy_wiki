import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
	// Supported locales
	locales: ['en', 'id', 'th', 'es'],

	// Default locale
	defaultLocale: 'en',

	// No prefix for default locale
	localePrefix: 'as-needed',

	// Enable auto detection
	localeDetection: true,
})

export type Locale = (typeof routing.locales)[number]
