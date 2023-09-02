'use client'
import React from 'react'

export default function SubmitButton({btnText}: {btnText: string}) {
  return (
    <input type="submit" value={btnText} name="submit" id='submit' className='main-btn sumbit-btn' />
  )
}
