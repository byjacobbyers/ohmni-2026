'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useCycle } from 'framer-motion'
import Route from '@/components/route'
import MenuButton from '@/components/header/menu-button'
import MobileNav from '@/components/navigation/mobile'
import { BaseRouteType } from '@/types/objects/route-type'
import { motion } from 'framer-motion'

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

  const closeMenu = () => {
    toggleDropdown()
  }

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full border-b-4 border-primary bg-background px-5"
      >
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className='flex items-end gap-2'>
            <h1
              className="text-2xl font-bold leading-none p-0 lg:text-3xl"
              title="Wiggelrhum"
            >
              Wiggelrhum
            </h1>
            <span className='text-sm uppercase'>
              At the baker house
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6 text-lg 2xl:text-2xl">
            {navigation?.items?.map((item, i) => (
              <Route
                key={i}
                data={item}
                className="font-bold uppercase hover:underline"
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
        {navigation && <MobileNav data={navigation} closeMenu={closeMenu} />}
      </motion.div>
    </>
  )
}
