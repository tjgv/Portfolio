type IconProps = { size?: number; className?: string }

export function ChevronDown({ size = 12, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="m12.431 15.957 6.774-6.776c.286-.285.286-.587 0-.873l-.26-.26c-.27-.285-.587-.3-.873-.015l-6.078 6.094-6.078-6.094c-.285-.286-.603-.27-.873.015l-.26.26c-.27.286-.27.603 0 .873l6.775 6.775c.294.294.588.286.873 0"
      />
    </svg>
  )
}

export function ArrowUpright({ size = 16, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5.643 18.644c.275.275.6.274.875 0L17.066 8.096l-.048 7.126c-.011.393.19.628.606.629h.412c.382 0 .607-.225.618-.618l.011-9.26c.011-.406-.214-.618-.617-.618H8.775c-.404 0-.617.213-.617.617v.412c0 .403.224.628.617.617l7.148-.048L5.375 17.5c-.274.274-.275.6 0 .875z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function NflPlusIcon({ size = 12, className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="M14.489 9.511 13.244 1.92h-2.488L9.511 9.511 1.92 10.756v2.488l7.591 1.245 1.245 7.591h2.488l1.245-7.591 7.59-1.245v-2.488z"
      />
    </svg>
  )
}

export function PlayIcon({ size = 12, className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8.331 19.034c4.052-1.85 7.832-4.075 11.418-6.598.373-.27.389-.603.016-.873-3.602-2.522-7.382-4.748-11.434-6.597-.412-.19-.706-.016-.746.436a79 79 0 0 0 0 13.196c.04.452.334.627.746.436"
      />
    </svg>
  )
}

export function MenuIcon({ size = 24, className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M20.5 6.513c.39 0 .62-.23.62-.619v-.378c0-.389-.23-.62-.62-.62H3.5c-.389 0-.619.231-.619.62v.378c0 .389.23.62.619.62zm0 6.287c.39 0 .62-.23.62-.619v-.379c0-.388-.23-.618-.62-.618H3.5c-.389 0-.619.23-.619.618v.38c0 .388.23.618.619.618zm0 6.303c.39 0 .62-.23.62-.619v-.378c0-.389-.23-.62-.62-.62H3.5c-.389 0-.619.231-.619.62v.378c0 .389.23.62.619.62z"
      />
    </svg>
  )
}
