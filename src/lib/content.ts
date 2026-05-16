import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import type { ReactNode } from 'react'
import { CONTENT_TYPES as CONFIG_CONTENT_TYPES } from '@/config/navigation'
import type { Locale } from '@/i18n/routing'

/**
 * 将文件名转换为 URL-safe slug
 * 所有非字母数字连字符下划线的字符（冒号、问号、井号、空格等）替换为 -
 * 合并连续的 -，去掉首尾 -
 */
function fileNameToSlug(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9\-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * 根据 slug 在目录中反查真实文件名（不含 .mdx）
 * 例如 slug="lucid-blocks-guide" → 返回 "lucid:blocks-guide"
 */
export function findFileBySlug(dir: string, slug: string, basePath: string[] = []): string | null {
  if (!fs.existsSync(dir)) return null
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      const result = findFileBySlug(fullPath, slug, [...basePath, entry.name])
      if (result) return result
    } else if (entry.name.endsWith('.mdx')) {
      const fileName = entry.name.replace('.mdx', '')
      const entrySlug = [...basePath, fileNameToSlug(fileName)].join('/')
      if (entrySlug === slug) {
        return [...basePath, fileName].join('/')
      }
    }
  }
  return null
}

// 通用 Frontmatter 接口
export interface ContentFrontmatter {
  title: string
  description: string
  category?: string
  image?: string
  date?: string
  lastModified?: string
  author?: string
  // 新增：可选的手动颜色配置
  themeColor?: string  // 十六进制颜色，如 "1e40af"
  backgroundText?: string  // 自定义背景文字
  // 扩展字段（用于不同内容类型）
  rarity?: string  // 用于 units
  type?: string    // 用于 traits
  code?: string    // 用于 codes
}

// 从统一配置导入内容类型
export const CONTENT_TYPES = CONFIG_CONTENT_TYPES
export type ContentType = typeof CONTENT_TYPES[number]

// 支持的语言（使用 routing.ts 中的 Locale 类型）
export type Language = Locale

// 内容项接口
export interface ContentItem {
  slug: string
  frontmatter: ContentFrontmatter
}

// 内容数据接口
export interface ContentData {
  content: string
  frontmatter: ContentFrontmatter
}

export interface ContentDetail {
  content: ReactNode
  frontmatter: ContentFrontmatter
  resolvedLanguage: Language
}

const CONTENT_ROOT = path.join(process.cwd(), 'content')

function stripYamlPrefix(source: string): string {
  return source.startsWith('yaml\n---\n') ? source.slice(5) : source
}

function readMatterFile(filePath: string): { content: string; frontmatter: ContentFrontmatter } {
  const source = fs.readFileSync(filePath, 'utf8')
  const { content, data } = matter(stripYamlPrefix(source))

  return {
    content,
    frontmatter: data as ContentFrontmatter,
  }
}

function getContentFilePath(contentType: ContentType, language: Language, slug: string): string | null {
  const contentDir = path.join(CONTENT_ROOT, language, contentType)
  const realSlug = findFileBySlug(contentDir, slug)

  if (!realSlug) {
    return null
  }

  return path.join(contentDir, `${realSlug}.mdx`)
}

export function getContentFrontmatter(
  contentType: ContentType,
  language: Language,
  slug: string
): ContentFrontmatter | null {
  const filePath = getContentFilePath(contentType, language, slug)

  if (filePath) {
    return readMatterFile(filePath).frontmatter
  }

  if (language !== 'en') {
    const fallbackPath = getContentFilePath(contentType, 'en', slug)
    if (fallbackPath) {
      return readMatterFile(fallbackPath).frontmatter
    }
  }

  return null
}

/**
 * 辅助函数：递归获取目录下所有 MDX 文件的 slug
 */
function getSlugsFromDirectory(dir: string, basePath: string[] = []): string[] {
  if (!fs.existsSync(dir)) return []

  const slugs: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      slugs.push(...getSlugsFromDirectory(fullPath, [...basePath, entry.name]))
    } else if (entry.name.endsWith('.mdx')) {
      const fileName = entry.name.replace('.mdx', '')
      slugs.push([...basePath, fileNameToSlug(fileName)].join('/'))
    }
  }
  return slugs
}

/**
 * 获取所有内容列表（支持递归读取嵌套目录）
 * 使用动态 import 获取 MDX 文件的 metadata
 */
export async function getAllContent(
  contentType: ContentType,
  language: Language
): Promise<ContentItem[]> {
  const items: ContentItem[] = []

  const contentDir = path.join(CONTENT_ROOT, language, contentType)
  let slugs = getSlugsFromDirectory(contentDir)

  if (language !== 'en') {
    const enContentDir = path.join(CONTENT_ROOT, 'en', contentType)
    const enSlugs = getSlugsFromDirectory(enContentDir)
    slugs = [...new Set([...slugs, ...enSlugs])]
  }

  for (const slug of slugs) {
    const frontmatter = getContentFrontmatter(contentType, language, slug)
    if (!frontmatter) {
      continue
    }

    items.push({
      slug,
      frontmatter,
    })
  }

  return items.sort((a, b) => {
    if (!a.frontmatter || !b.frontmatter) {
      console.warn('Missing frontmatter in content item:', { a: a.slug, b: b.slug })
      return 0
    }
    if (!a.frontmatter.date || !b.frontmatter.date) return 0
    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  })
}

/**
 * 获取所有内容路径（用于 generateStaticParams）
 * 返回格式: [['guide', 'beginner'], ['unit', 'jinwoo'], ...]
 */
export async function getAllContentPaths(): Promise<string[][]> {
  const paths: string[][] = []

  for (const contentType of CONTENT_TYPES) {
    const contentDir = path.join(CONTENT_ROOT, 'en', contentType)

    const scanDirectory = (dir: string, basePath: string[] = []) => {
      if (!fs.existsSync(dir)) return

      const entries = fs.readdirSync(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
          scanDirectory(fullPath, [...basePath, entry.name])
        } else if (entry.name.endsWith('.mdx')) {
          const fileName = entry.name.replace('.mdx', '')
          paths.push([contentType, ...basePath, fileNameToSlug(fileName)])
        }
      }
    }

    scanDirectory(contentDir)
  }

  return paths
}

/**
 * 获取所有内容的 slug（用于 generateStaticParams）
 */
export async function getAllContentSlugs(
  contentType: ContentType,
  language: Language
): Promise<string[]> {
  const items = await getAllContent(contentType, language)
  return items.map(item => item.slug)
}

export async function getContentDetail(
  contentType: ContentType,
  language: Language,
  slug: string
): Promise<ContentDetail | null> {
  const localizedFilePath = getContentFilePath(contentType, language, slug)
  const fallbackFilePath = language !== 'en' ? getContentFilePath(contentType, 'en', slug) : null
  const filePath = localizedFilePath || fallbackFilePath

  if (!filePath) {
    return null
  }

  const { content, frontmatter } = readMatterFile(filePath)
  const compiled = await compileMDX({
    source: content,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [],
      },
    },
  })

  return {
    content: compiled.content,
    frontmatter,
    resolvedLanguage: filePath === localizedFilePath ? language : 'en',
  }
}

/**
 * 验证内容类型是否有效
 */
export function isValidContentType(type: string): type is ContentType {
  return CONTENT_TYPES.includes(type as ContentType)
}

/**
 * 验证语言是否有效
 */
export function isValidLanguage(lang: string): lang is Language {
  const validLanguages: Language[] = ['en', 'id', 'th', 'es']
  return validLanguages.includes(lang as Language)
}

/**
 * 获取默认语言
 */
export function getDefaultLanguage(): Language {
  return 'en'
}
