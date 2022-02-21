import { element, string } from 'prop-types'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { saveResponce, zeroResponce } from '../redux/store'
import classes from './style/app.module.scss'
interface book {
  accessInfo: {
    accessViewStatus: string
    country: string
  }
  id: string
  saleInfo: {
    country: string
    isEbook: boolean
    saleability: string
  }
  volumeInfo: {
    imageLinks: {
      smallThumbnail: string
    }
    title: string
    categories: string[]
    authors: string[]
  }
}
interface responce {
  totalItems: number
  items: book[]
}
const infoObj = {}
const App = () => {
  const dispatch = useDispatch()
  const booksData = useSelector((state: responce) => state)
  //dispatch(saveResponce({ items: 's', totalItems: 1 }))
  //console.log(booksData)
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState('all')
  const [startIndex, setStartIndex] = useState(0)
  const [countResults, setCountResults] = useState(6)
  const [bookData, setBookData] = useState({
    totalItems: [' '],
    items: [
      {
        accessInfo: { accessViewStatus: ' ', country: ' ' },
        id: ' ',
        saleInfo: { country: ' ', isEbook: false, saleability: ' ' },
        volumeInfo: {
          imageLinks: {
            smallThumbnail: ' ',
          },
          title: ' ',
          categories: [' '],
          authors: [' '],
        },
      },
    ],
  })
  const [loading, setLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [sorting, setSorting] = useState('relevance')
  function smthHandler(e: any) {
    console.log(e)
  }
  function requestBooks() {
    setLoading(false)
    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${
        search || 1
      }:subject=${categories}&key=AIzaSyBM0NU2vSiu6Q9_JRFR5n2kAkheGVtHVOE&startIndex=${startIndex}&maxResults=${countResults}&orderBy=${sorting}`
    )
      .then((responce) => {
        if (responce.ok) {
          return responce.json()
        }
        throw responce
      })
      .then((data: responce) => {
        console.log(data)
        if (data.totalItems > 0) {
          dispatch(saveResponce(data))
        } else {
          dispatch(zeroResponce())
        }
        //setBookData(data)
      })
      .catch((error) => console.error('error: ', error))
      .finally(() => setLoading(true))
  }
  useEffect(() => {
    requestBooks()
  }, [isSearching, startIndex])
  function handleSubmit(e: { preventDefault: any }) {
    e.preventDefault()
    //setCountResults(30)
    setIsSearching((prev) => !prev)
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          autoFocus
          type='text'
          //ref={inputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='book'
        />
        <button type='submit' id='searchBtn'>
          Search
        </button>
        <label htmlFor='categories'>categories</label>
        <select
          name=''
          id='categories'
          value={categories}
          onChange={(event) => setCategories(event.target.value)}
        >
          <option value='all'>all</option>
          <option value='art'>art</option>
          <option value='biography'>biography</option>
          <option value='computers'>computers</option>
          <option value='history'>history</option>
          <option value='medical'>medical</option>
          <option value='poetry'>poetry</option>
        </select>
        <label htmlFor='sorting_by'>sorting by</label>
        <select
          name=''
          id='sorting_by'
          value={sorting}
          onChange={(event) => setSorting(event.target.value)}
        >
          <option value='relevance'>relevance</option>
          <option value='newest'>newest</option>
        </select>
      </form>
      {`Количестов найденных книг: ${booksData.totalItems}`}
      <div className={classes.books} onClick={smthHandler}>
        {!loading ? (
          <p>...Loading</p>
        ) : (
          <>
            {console.log(booksData)}
            {!Array.isArray(booksData.totalItems) ? (
              booksData.items.map((data: book) => (
                <div className={classes.bookContainer} key={data.id}>
                  <div className={classes.imgContainer}>
                    <img
                      key={data.id}
                      //className={classes.imgBooks}
                      src={
                        data.volumeInfo.imageLinks?.smallThumbnail ||
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'
                      }
                      alt=''
                    />
                    <p>{data.volumeInfo.title}</p>
                    <p>
                      {'categories: ' +
                        (Array.isArray(data.volumeInfo.categories)
                          ? data.volumeInfo.categories[0]
                          : 'no Category')}
                    </p>
                    <div>
                      Author's name:
                      {Array.isArray(data.volumeInfo.authors)
                        ? data.volumeInfo.authors?.map((name) => ' ' + name)
                        : ' No Author'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>no Images</p>
            )}
          </>
        )}
      </div>
      <button
        onClick={() => {
          //setCountResults((prev) => prev + 30)
          setStartIndex((prev) => prev + 30)
        }}
      >
        Show More
      </button>
    </>
  )
}

export default App
