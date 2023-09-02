import React, { MouseEventHandler } from 'react'

export default function AddButton({btnText, onClickHandler}: {btnText: string, onClickHandler: MouseEventHandler<HTMLButtonElement> | undefined}) {
  return (
    <button className='add-btn btn' onClick={onClickHandler}>
        {btnText}
    </button>
  )
}
