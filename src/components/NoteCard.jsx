import React from 'react'
import { FaCheck, FaDeleteLeft, FaPen } from 'react-icons/fa6'

const NoteCard = ({date, title, type, note, clickHandler, completeHandler, editHandler}) => {
  return (
    <div className='relative p-4 flex w-[20dvw] flex-col justify-content-between gap-y-3 font-poppins border-white border-2 rounded-xl cursor-pointer ' style={{ zIndex: 10 }}>
      <span className="absolute text-2xl right-5 top-4 z-10" onClick={clickHandler}>
      <FaDeleteLeft/>
      </span>
      <span className="absolute text-2xl right-15 top-4 z-10" onClick={completeHandler}>
      <FaCheck/>
      </span>
      <span className="absolute text-2xl right-25 top-4 z-10" onClick={editHandler}>
      <FaPen/>
      </span>
      <p className='text-sm opacity-50'>{new Date(date).toDateString()}</p>
      <p>{type}</p>
      <h1 className='text-2xl'>{title}</h1>
      <p>{note}</p>
    </div>
  )
}

export default NoteCard