'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {codeInput} from '@sanity/code-input'
import {defineDocuments, defineLocations, presentationTool} from 'sanity/presentation'
import {muxInput} from 'sanity-plugin-mux-input'
import {media} from 'sanity-plugin-media'

import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemas'
import {structure} from './sanity/structure'
import { browseSectionGalleryAction } from './sanity/actions/browse-section-gallery-action'
import { resolvePostLocations } from './sanity/presentation/locations'
import { brand } from '@/lib/brand'
import { getPublicSiteUrl } from '@/lib/site-url'

// Prefer explicit preview origin; otherwise local in next dev, production URL in prod.
// Do NOT fall back to NEXT_PUBLIC_SITE_URL while developing — Presentation would
// try to talk to production from a localhost Studio and hang on “Resolving locations…”.
const previewOrigin =
  process.env.SANITY_STUDIO_PREVIEW_ORIGIN?.replace(/\/+$/, '') || getPublicSiteUrl()

const SECTION_DOC_TYPES = new Set(['page', 'post', 'event'])

export default defineConfig({
  name: 'default',
  title: brand.name,
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({structure}),
    codeInput(),
    media(),
    muxInput(),
    presentationTool({
      previewUrl: {
        origin: previewOrigin,
        preview: '/',
        draftMode: { enable: '/api/draft-mode/enable' },
      },
      resolve: {
        // Map preview URLs → documents so Presentation opens the right editor.
        mainDocuments: defineDocuments([
          { route: '/', filter: `_type == "page" && slug.current == "home"` },
          { route: '/posts', filter: `_type == "page" && slug.current == "posts"` },
          { route: '/posts/:slug', filter: `_type == "post" && slug.current == $slug` },
          { route: '/events', filter: `_type == "page" && slug.current == "events"` },
          { route: '/events/:slug', filter: `_type == "event" && slug.current == $slug` },
          { route: '/:slug', filter: `_type == "page" && slug.current == $slug` },
        ]),
        locations: {
          page: defineLocations({
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => {
              if (!doc?.slug) {
                return { message: 'Add a slug to preview this page', tone: 'caution' }
              }
              return {
                locations: [
                  {
                    title: doc.title || 'Untitled',
                    href: doc.slug === 'home' ? '/' : `/${doc.slug}`,
                  },
                ],
              }
            },
          }),
          event: defineLocations({
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => {
              if (!doc?.slug) {
                return { message: 'Add a slug to preview this event', tone: 'caution' }
              }
              return {
                locations: [
                  { title: doc.title || 'Untitled', href: `/events/${doc.slug}` },
                  { title: 'Events', href: '/events' },
                ],
              }
            },
          }),
          // listenQuery — observeForPreview hung forever for posts in this Studio
          post: resolvePostLocations,
          postCtaSettings: defineLocations({
            message: 'Default closing CTA for posts that do not set their own',
            tone: 'caution',
          }),
        },
      },
    }),
    visionTool({defaultApiVersion: apiVersion}),
  ],
  document: {
    actions: (prev, context) => {
      if (SECTION_DOC_TYPES.has(context.schemaType)) {
        return [...prev, browseSectionGalleryAction]
      }
      return prev
    },
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter(
          (template) =>
            template.templateId !== 'mux.videoAsset' &&
            template.templateId !== 'postCtaSettings' &&
            template.templateId !== 'formSettings' &&
            template.templateId !== 'site'
        )
      }
      return prev
    },
  },
})
