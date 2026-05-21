import type { LucideIcon } from 'lucide-react'
import { BookText, Compass, Sparkles, FlaskConical, Backpack, Pickaxe, Gamepad2, MessageSquare } from 'lucide-react'

export interface NavigationItem {
	key: string
	path: string
	icon: LucideIcon
	isContentType: boolean
}

export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'codes', path: '/codes', icon: BookText, isContentType: true },
	{ key: 'guide', path: '/guide', icon: Compass, isContentType: true },
	{ key: 'races', path: '/races', icon: Sparkles, isContentType: true },
	{ key: 'potions', path: '/potions', icon: FlaskConical, isContentType: true },
	{ key: 'items', path: '/items', icon: Backpack, isContentType: true },
	{ key: 'farming', path: '/farming', icon: Pickaxe, isContentType: true },
	{ key: 'roblox', path: '/roblox', icon: Gamepad2, isContentType: true },
]

export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map((item) =>
	item.path.slice(1),
)

export type ContentType = (typeof CONTENT_TYPES)[number]

export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
