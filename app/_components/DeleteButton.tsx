'use client'

import React, { MouseEventHandler } from 'react'

export default function DeleteButton({btnText, onClickHandler}: {btnText: string, onClickHandler: MouseEventHandler<HTMLButtonElement> | undefined}) {
  return (
    <button className='btn-delete' type='button' onClick={onClickHandler}>
        {btnText}
    </button>
  )
}
