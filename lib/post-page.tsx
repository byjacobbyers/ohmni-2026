import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { postQuery } from '@/sanity/queries/documents/post-query'
import { postCtaSettingsQuery } from '@/sanity/queries/documents/post-cta-settings-query'
import { SiteQuery } from '@/sanity/queries/documents/site-query'
import PostSingle from '@/components/post-single'
import { resolveBrand, type BrandSiteInput } from '@/lib/brand'
import { DEFAULT_LOCALE, localizePath, t, type Locale } from '@/lib/i18n'
import {
  buildUrl,
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  generateMetadata as generateSeoMetadata,
  type SeoType,
} from '@/lib/seo'
import { hreflangFor, JsonLdScript, ogLocale } from '@/lib/content-page'
import { markdownPath } from '@/lib/llms'
import {
  authorDisplayName,
  type PostCtaSection,
  type PostSingleData,
} from '@/types/components/post-single-type'
import type { PostQueryResult, SiteQueryResult } from '@/sanity.types'

async function fetchPost(slug: string, lang: Locale, stega?: false) {
  const { data } = await sanityFetch({
    query: postQuery,
    params: { slug, lang },
    ...(stega === false && { stega: false }),
  })
  return data as PostQueryResult | null
}

/** Same fallback rule as pages: English when the translation does not exist. */
async function fetchPostWithFallback(slug: string, lang: Locale, stega?: false) {
  const post = await fetchPost(slug, lang, stega)
  if (post || lang === DEFAULT_LOCALE) return { post, served: lang }
  return { post: await fetchPost(slug, DEFAULT_LOCALE, stega), served: DEFAULT_LOCALE }
}

export async function postMetadata(slug: string, lang: Locale = DEFAULT_LOCALE): Promise<Metadata> {
  try {
    const [{ post, served }, { data: globalData }] = await Promise.all([
      fetchPostWithFallback(slug, lang, false),
      sanityFetch({ query: SiteQuery, stega: false }),
    ])
    const global = globalData as SiteQueryResult | null
    if (!post) return generateSeoMetadata()

    const path = `/posts/${slug}`
    const fallback = served !== lang
    const seo = (post.seo ?? undefined) as SeoType | undefined
    return generateSeoMetadata(
      fallback ? { ...seo, canonicalUrl: seo?.canonicalUrl || path } : seo,
      (global?.seo ?? undefined) as SeoType | undefined,
      post.title ?? undefined,
      post.excerpt ?? undefined,
      {
        url: localizePath(path, lang),
        titleSuffix: resolveBrand(global as BrandSiteInput | null).titleSuffix,
        ogDocument: { slug, type: 'post', lang: served },
        languages: fallback
          ? undefined
          : hreflangFor(path, (post as { alternates?: Array<string | null> }).alternates),
        locale: ogLocale(lang),
        markdown: markdownPath(path, lang),
        article: {
          publishedTime: post.publishedAt ?? undefined,
          modifiedTime: post._updatedAt,
          author: authorDisplayName(
            post.author
              ? { title: post.author.title ?? undefined, slug: post.author.slug ?? undefined }
              : null
          ),
        },
      }
    )
  } catch {
    return generateSeoMetadata()
  }
}

export async function renderPost(slug: string, lang: Locale = DEFAULT_LOCALE) {
  let post: PostQueryResult | null = null
  let global: SiteQueryResult | null = null
  let defaultCta: PostCtaSection | null = null
  try {
    const [postRes, siteData, ctaSettings] = await Promise.all([
      fetchPostWithFallback(slug, lang),
      sanityFetch({ query: SiteQuery, stega: false }),
      sanityFetch({ query: postCtaSettingsQuery, params: { lang }, stega: false }),
    ])
    post = postRes.post
    global = siteData.data as SiteQueryResult | null
    // Singleton first; site.postCta remains a legacy fallback.
    defaultCta =
      ((ctaSettings.data as { cta?: PostCtaSection | null } | null)?.cta ?? null) ||
      ((global?.postCta as PostCtaSection | null | undefined) ?? null)
  } catch {
    notFound()
  }

  if (!post) notFound()

  const path = localizePath(`/posts/${slug}`, lang)
  const title = post.title ?? 'Untitled'
  const schemas: unknown[] = [
    generateArticleJsonLd({
      title,
      description: post.seo?.metaDesc ?? post.excerpt ?? undefined,
      url: path,
      publishedAt: post.publishedAt ?? undefined,
      author: post.author
        ? {
            title: post.author.title ?? undefined,
            slug: post.author.slug ?? undefined,
            primaryJobTitle: post.author.primaryJobTitle ?? undefined,
          }
        : null,
      category: post.category ?? undefined,
      image: (post.image ?? undefined) as { asset?: { url?: string } } | undefined,
      _updatedAt: post._updatedAt,
      jsonLd: post.jsonLd,
      publisherName: resolveBrand(global as BrandSiteInput | null).name,
      publisherLogoUrl: buildUrl('/ohmni.svg'),
      inLanguage: lang,
    }),
  ]
  const breadcrumb = generateBreadcrumbJsonLd([
    { name: t(lang, 'posts'), url: localizePath('/posts', lang) },
    { name: title, url: path },
  ])
  if (breadcrumb) schemas.push(breadcrumb)

  return (
    <>
      <JsonLdScript id="post-jsonld" schemas={schemas} />
      <PostSingle
        post={{ ...post, shareUrl: buildUrl(path) } as PostSingleData}
        defaultCta={defaultCta}
        lang={lang}
        key={post._id}
      />
    </>
  )
}
