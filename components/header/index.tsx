'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useCycle } from 'framer-motion'
import AuroraBits from '@/components/aurora-bits'
import Route from '@/components/route'
import MenuButton from '@/components/header/menu-button'
import MobileNav from '@/components/navigation/mobile'
import { PRIMARY_AURORA_STOPS } from '@/components/ui/primary-button-aurora-layers'
import { cn } from '@/lib/utils'
import { BaseRouteType } from '@/types/objects/route-type'
import { motion } from 'framer-motion'

const BOOK_NOW_TITLE = 'Book Now'

type HeaderProps = {
  navigation?: { items?: BaseRouteType[] } | null
}

export default function Header({ navigation }: HeaderProps) {
  const [isOpen, toggleDropdown] = useCycle(false, true)
  const headerRef = useRef<HTMLElement>(null)
  const [dimensions, setDimensions] = useState({ height: 64 })
  const [headerAuroraActive, setHeaderAuroraActive] = useState(false)
  const [headerAuroraMounted, setHeaderAuroraMounted] = useState(false)

  useEffect(() => {
    const measure = () => {
      if (headerRef.current) {
        setDimensions({ height: headerRef.current.offsetHeight })
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const closeMenu = () => {
    toggleDropdown()
  }

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full border-b-4 border-primary px-5 isolate overflow-hidden"
      >
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 z-0 bg-background transition-opacity duration-300 ease-out',
            headerAuroraActive && 'opacity-0 motion-reduce:opacity-100'
          )}
        />
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ease-out opacity-0 motion-reduce:opacity-0',
            headerAuroraActive && 'opacity-100'
          )}
        >
          {headerAuroraMounted ? (
            <div className="relative h-full min-h-16 w-full">
              <span aria-hidden className="absolute inset-0 bg-muted/40" />
              <AuroraBits
                colorStops={[...PRIMARY_AURORA_STOPS]}
                blend={0.5}
                amplitude={1}
                speed={0.6}
              />
            </div>
          ) : null}
        </div>
        <div className="relative z-10 flex h-16 items-center justify-between">
          <Link href="/" className='flex items-end gap-2'>
            <h1
              className="text-2xl font-bold leading-none p-0 lg:text-3xl"
              title="Ohmni"
            >
              OHMNI
            </h1>
            <span className='text-sm uppercase'>
              Web Technologies
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6 text-lg 2xl:text-2xl">
            {navigation?.items?.map((item, i) => {
              const isBookNow = item.title === BOOK_NOW_TITLE
              return (
                <Route
                  key={i}
                  data={item}
                  className="font-bold uppercase transition duration-200 ease-out hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100"
                  onMouseEnter={
                    isBookNow
                      ? () => {
                          setHeaderAuroraMounted(true)
                          setHeaderAuroraActive(true)
                        }
                      : undefined
                  }
                  onMouseLeave={
                    isBookNow ? () => setHeaderAuroraActive(false) : undefined
                  }
                >
                  {item.title || 'Link'}
                </Route>
              )
            })}
          </nav>
          <div className="flex lg:hidden">
            <MenuButton
              onClick={() => toggleDropdown()}
              isOpen={isOpen}
              defaultColor="var(--foreground)"
            />
          </div>
        </div>
      </header>

      <motion.div
        initial={'closed'}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 1, ease: [0.83, 0, 0.17, 1] }}
        variants={{
          closed: {
            y: '-100%',
            opacity: 0,
          },
          open: {
            y: 0,
            opacity: 1,
          },
        }}
        style={{
          paddingTop: dimensions.height,
        }}
        className='fixed left-0 top-0 z-40 flex h-screen w-screen flex-col items-center overflow-scroll bg-background px-5 text-center xl:hidden'
      >
        {navigation && (
          <MobileNav
            data={navigation}
            closeMenu={closeMenu}
            onBookNowHoverChange={(active) => {
              if (active) setHeaderAuroraMounted(true)
              setHeaderAuroraActive(active)
            }}
          />
        )}
      </motion.div>
    </>
  )
}
