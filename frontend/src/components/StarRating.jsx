import React from 'react'
import { FiStar } from 'react-icons/fi'

const StarRating = ({ rating, interactive = false, onRate = null, size = 18 }) => {
  const [hovered, setHovered] = React.useState(0)

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate && onRate(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`transition-transform ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          <FiStar
            size={size}
            className={
              star <= (hovered || rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300'
            }
          />
        </button>
      ))}
    </div>
  )
}

export default StarRating

