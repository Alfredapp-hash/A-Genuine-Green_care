'use client'
// TODO: Replace with Saltwater Sprouts design system button
import Link from 'next/link'
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react'

export type PremiumButtonVariant =
  | 'primary'
  | 'outline'
  | 'ghost'
  | 'navy'
  | 'gold'
  | 'filter'
  | 'filterActive'

type PremiumButtonProps = {
  href?: string
  children: ReactNode
  variant?: PremiumButtonVariant
  size?: 'sm' | 'md' | 'lg'
  shape?: 'pill' | 'rounded'
  className?: string
  external?: boolean
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLElement>
  ariaLabel?: string
}

export default function PremiumButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  shape = 'pill',
  className = '',
  external,
  type = 'button',
  disabled,
  onClick,
  ariaLabel,
}: PremiumButtonProps) {
  const base = `inline-flex items-center justify-center gap-2 font-semibold transition-all ${
    shape === 'pill' ? 'rounded-full' : 'rounded-lg'
  } ${size === 'sm' ? 'px-4 py-2 text-sm' : size === 'lg' ? 'px-9 py-3.5 text-lg' : 'px-7 py-3 text-base'} ${className}`

  const variantStyle =
    variant === 'primary' ? 'bg-[#2c6b4a] text-white hover:bg-[#1e4e35]' :
    variant === 'ghost' ? 'border border-white/30 text-white hover:bg-white/10' :
    variant === 'filter' ? 'border border-gray-200 text-gray-600 bg-white hover:bg-gray-50' :
    variant === 'filterActive' ? 'border border-[#2c6b4a] text-[#2c6b4a] bg-[#2c6b4a]/10' :
    'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'

  if (href) {
    return (
      <Link
        href={href}
        className={`${base} ${variantStyle}`}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${base} ${variantStyle} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  )
}
