import * as React from 'react'
import { cn } from '@/lib/utils'

type AvatarProps = React.ComponentProps<'div'>

function Avatar({ className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-semibold uppercase',
        className
      )}
      {...props}
    />
  )
}

type AvatarImageProps = React.ComponentProps<'img'>

function AvatarImage({ className, alt, ...props }: AvatarImageProps) {
  return (
    <img
      alt={alt}
      className={cn('h-full w-full object-cover', className)}
      loading="lazy"
      {...props}
    />
  )
}

type AvatarFallbackProps = React.ComponentProps<'span'>

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <span
      className={cn('absolute inset-0 flex items-center justify-center', className)}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
