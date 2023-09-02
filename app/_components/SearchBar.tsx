"use client"
import React, {useContext, useEffect, useState } from 'react'
import SecundarySubmitBtn from './SecundarySubmitBtn';
import { AppContext } from '../_contexts/AppContext';


export default function SearchBar({searchHandler}) {
  const {setSearchTerm, searchTerm} = useContext(AppContext);

  return (
    <div className='searchbar-container'>
      <form onSubmit={searchHandler}>
        <div className="form-control">
          <input type="text" name="search" id="search"
          className='search-input' placeholder='Looking for something...'
          onChange={ (e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='button-wrapper'>
          <SecundarySubmitBtn btnText='Search' />
        </div>
          

      </form>
    </div>
  )
}
