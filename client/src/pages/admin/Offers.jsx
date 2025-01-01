import React from 'react'
import Product_Offers from '../../components/user/Offers/Product_Offers/Product_Offers'
import Categories_Offers from '../../components/user/Offers/Categories_Offers/Categories_Offers'

const Offers = () => {
  return (
    <div className='flex flex-col gap-y-14'>
      <Product_Offers/>
      <Categories_Offers/>
    </div>
  )
}

export default Offers