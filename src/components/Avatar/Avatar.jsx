import PropTypes from 'prop-types'

/**
 * Avatar component with fallback to initials
 * @param {Object} props
 * @param {string} props.src - Image URL
 * @param {string} props.name - User name for initials
 * @param {string} props.size - Size variant: 'sm', 'md', 'lg', 'xl'
 * @param {string} props.className - Additional CSS classes
 */
export const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl'
  }

  const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  const getColorFromName = (name) => {
    if (!name) return 'bg-gray-400'
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
        onError={(e) => {
          e.target.style.display = 'none'
          e.target.nextElementSibling?.classList.remove('hidden')
        }}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} ${getColorFromName(name)} rounded-full flex items-center justify-center text-white font-semibold ${className}`}
    >
      {getInitials(name)}
    </div>
  )
}

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string
}
