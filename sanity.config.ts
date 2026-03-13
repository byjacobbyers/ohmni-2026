'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {codeInput} from '@sanity/code-input'
import {presentationTool} from 'sanity/presentation'

import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemas'
import {structure} from './sanity/structure'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default defineConfig({
  name: 'default',
  title: 'Wiggelrhum',
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({structure}),
    codeInput(),
    presentationTool({
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_ORIGIN || baseUrl,
        preview: '/',
        draftMode: { enable: '/api/draft-mode/enable' },
      },
      resolve: {
        locations: {
          page: {
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [{ title: doc?.title || 'Untitled', href: doc?.slug === 'home' ? '/' : `/${doc?.slug || ''}` }],
            }),
          },
          event: {
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [{ title: doc?.title || 'Untitled', href: `/events/${doc?.slug || ''}` }],
            }),
          },
        },
      },
    }),
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
