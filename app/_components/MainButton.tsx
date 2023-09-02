'use client'

import React, { MouseEventHandler } from 'react'

export default function MainButton({btnText, onClickHandler}: {btnText: string, onClickHandler: MouseEventHandler<HTMLButtonElement> | undefined}) {
  return (
    <button className='main-btn' onClick={onClickHandler}>
        {btnText}
    </button>
  )
}
