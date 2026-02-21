import React from 'react'
import { SongPanel } from '~/components/create/song-panel'

const CreatePage = () => {
  return (
    <div className='flex h-full flex-col lg:flex-row'>
      <SongPanel/>
    </div>
  )
}

export default CreatePage