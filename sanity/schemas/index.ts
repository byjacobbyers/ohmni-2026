import { type SchemaTypeDefinition } from 'sanity'

import page from './documents/page-schema'
import site from './documents/site-schema'
import announcement from './documents/announcement-schema'
import event from './documents/event-schema'
import eventCategory from './documents/event-category-schema'
import post from './documents/post-schema'
import postCategory from './documents/post-category-schema'
import redirect from './documents/redirect-schema'
import navigation from './documents/navigation-schema'
import form from './documents/form-schema'
import formSettings from './documents/form-settings-schema'
import postCtaSettings from './documents/post-cta-settings-schema'
import team from './documents/team-schema'

import seo from './components/seo-schema'
import sections from './components/page-builder-schema'
import bannerBlock from './components/banner-block-schema'
import heroBlock from './components/hero-block-schema'
import coverBlock from './components/cover-block-schema'
import ctaBlock from './components/cta-block-schema'
import textBlock from './components/text-block-schema'
import faqBlock from './components/faq-block-schema'
import imageBlock from './components/image-block-schema'
import embedBlock from './components/embed-block-schema'
import formBlock from './components/form-block-schema'
import columnBlock from './components/column-block-schema'
import galleryBlock from './components/gallery-block-schema'
import dividerBlock from './components/divider-block-schema'
import splitScrollBlock from './components/split-scroll-block-schema'
import postsBlock from './components/posts-block-schema'
import eventsBlock from './components/events-block-schema'
import teamMemberBlock from './components/team-member-block-schema'
import logoBarBlock from './components/logo-bar-block-schema'
import quoteBlock from './components/quote-block-schema'
import statsBlock from './components/stats-block-schema'

import column from './objects/column-schema'
import defaultImage from './objects/default-img-schema'
import cta from './objects/cta-schema'
import route from './objects/route-schema'
import linkWithRoute from './objects/link-annotation-schema'
import simpleText from './objects/simple-text-schema'
import normalText from './objects/normal-text-schema'
import formField from './objects/form-field-schema'
import social from './objects/social-schema'
import pageJsonLd from './objects/page-json-ld-schema'
import articleJsonLd from './objects/article-json-ld-schema'
import eventJsonLd from './objects/event-json-ld-schema'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    page,
    site,
    announcement,
    event,
    eventCategory,
    post,
    postCategory,
    team,
    redirect,
    navigation,
    form,
    formSettings,
    postCtaSettings,
    seo,
    sections,
    bannerBlock,
    heroBlock,
    coverBlock,
    ctaBlock,
    textBlock,
    faqBlock,
    imageBlock,
    embedBlock,
    formBlock,
    columnBlock,
    galleryBlock,
    dividerBlock,
    splitScrollBlock,
    postsBlock,
    eventsBlock,
    teamMemberBlock,
    logoBarBlock,
    quoteBlock,
    statsBlock,
    column,
    defaultImage,
    cta,
    route,
    linkWithRoute,
    simpleText,
    normalText,
    formField,
    social,
    pageJsonLd,
    articleJsonLd,
    eventJsonLd,
  ],
}
