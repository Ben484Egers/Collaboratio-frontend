'use client'

export default function SecundarySubmitBtn({btnText}: {btnText: string}) {
  return (
    <input type="submit" value={btnText} name="submit"id='submit' className='secundary-btn sumbit-btn' />
  )
}
