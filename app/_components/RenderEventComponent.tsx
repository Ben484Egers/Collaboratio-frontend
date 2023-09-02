import React from 'react'
import Link from 'next/link'


// Custom render function
export default function RenderEventComponent({eventInfo}) {
    return (
      <div className={`event-render-content`}>
        <p>{eventInfo?.event.title}</p>
      </div>
    )
}
