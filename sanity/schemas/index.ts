import { type SchemaTypeDefinition } from 'sanity'

import page from './documents/page-schema'
import site from './documents/site-schema'
import announcement from './documents/announcement-schema'
import event from './documents/event-schema'
import post from './documents/post-schema'
import redirect from './documents/redirect-schema'
import navigation from './documents/navigation-schema'

import seo from './components/seo-schema'
import sections from './components/page-builder-schema'
import bannerBlock from './components/banner-block-schema'
import heroBlock from './components/hero-block-schema'
import coverBlock from './components/cover-block-schema'
import coverVideo from './components/cover-video-schema'
import ctaBlock from './components/cta-block-schema'
import textBlock from './components/text-block-schema'
import faqBlock from './components/faq-block-schema'
import imageBlock from './components/image-block-schema'
import embedBlock from './components/embed-block-schema'
import formBlock from './components/form-block-schema'
import columnBlock from './components/column-block-schema'
import projectColumnsBlock from './components/project-columns-block-schema'
import galleryBlock from './components/gallery-block-schema'
import videoBlock from './components/video-block-schema'
import spacerBlock from './components/spacer-block-schema'
import dividerBlock from './components/divider-block-schema'
import splitScrollBlock from './components/split-scroll-block-schema'
import problemBlock from './components/problem-block-schema'
import postsBlock from './components/posts-block-schema'
import splitFormBlock from './components/split-form-block-schema'

import column from './objects/column-schema'
import project from './objects/project-schema'
import defaultImage from './objects/default-img-schema'
import cta from './objects/cta-schema'
import route from './objects/route-schema'
import linkWithRoute from './objects/link-annotation-schema'
import simpleText from './objects/simple-text-schema'
import normalText from './objects/normal-text-schema'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    page,
    site,
    announcement,
    event,
    post,
    redirect,
    navigation,
    seo,
    sections,
    bannerBlock,
    heroBlock,
    coverBlock,
    coverVideo,
    ctaBlock,
    textBlock,
    faqBlock,
    imageBlock,
    embedBlock,
    formBlock,
    columnBlock,
    projectColumnsBlock,
    galleryBlock,
    videoBlock,
    spacerBlock,
    dividerBlock,
    splitScrollBlock,
    problemBlock,
    postsBlock,
    splitFormBlock,
    column,
    project,
    defaultImage,
    cta,
    route,
    linkWithRoute,
    simpleText,
    normalText,
  ],
}
