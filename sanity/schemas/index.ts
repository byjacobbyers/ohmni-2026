import { type SchemaTypeDefinition } from 'sanity'

import page from './documents/page-schema'
import site from './documents/site-schema'
import event from './documents/event-schema'
import navigation from './documents/navigation-schema'

import seo from './components/seo-schema'
import sections from './components/page-builder-schema'
import heroBlock from './components/hero-block-schema'
import ctaBlock from './components/cta-block-schema'
import textBlock from './components/text-block-schema'
import faqBlock from './components/faq-block-schema'
import imageBlock from './components/image-block-schema'
import embedBlock from './components/embed-block-schema'
import spacerBlock from './components/spacer-block-schema'
import dividerBlock from './components/divider-block-schema'

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
    event,
    navigation,
    seo,
    sections,
    heroBlock,
    ctaBlock,
    textBlock,
    faqBlock,
    imageBlock,
    embedBlock,
    spacerBlock,
    dividerBlock,
    defaultImage,
    cta,
    route,
    linkWithRoute,
    simpleText,
    normalText,
  ],
}
