import React from 'react'

const EmptyCard = ({message}) => {
  return (
    <div className='flex items-center justify-center mt-20 text-lg font-medium text-slate-700 text-center'>{message}</div>
  )
}

export default EmptyCard