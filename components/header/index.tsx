'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useCycle } from 'framer-motion'
import Route from '@/components/route'
import MenuButton from '@/components/header/menu-button'
import MobileNav from '@/components/navigation/mobile'
import { BaseRouteType } from '@/types/objects/route-type'
import { m } from 'framer-motion'

type HeaderProps = {
  navigation?: { items?: BaseRouteType[] } | null
}

export default function Header({ navigation }: HeaderProps) {
  const [isOpen, toggleDropdown] = useCycle(false, true)
  const headerRef = useRef<HTMLElement>(null)
  const [dimensions, setDimensions] = useState({ height: 64 })

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

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full border-b-4 border-black bg-background px-5"
      >
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <h1
              className="text-2xl font-bold tracking-[-0.25rem] leading-none p-0 lg:text-3xl"
              title="Wiggelrhum"
            >
              Wiggelrhum
            </h1>
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            {navigation?.items?.map((item, i) => (
              <Route
                key={i}
                data={item}
                className="text-sm font-medium hover:opacity-80"
              >
                {item.title || 'Link'}
              </Route>
            ))}
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

      <m.div
        className={`fixed inset-0 z-40 xl:hidden bg-background ${!isOpen ? 'pointer-events-none' : ''}`}
        style={{ paddingTop: dimensions.height }}
        initial={false}
        animate={
          isOpen
            ? { opacity: 1, visibility: 'visible' }
            : { opacity: 0, visibility: 'hidden' }
        }
        transition={{ duration: 0.2 }}
      >
        {isOpen && (
          <div className="flex flex-col items-center justify-start pt-8 px-5">
            {navigation ? (
              <MobileNav data={navigation} closeMenu={() => toggleDropdown()} />
            ) : null}
          </div>
        )}
      </m.div>
    </>
  )
}
