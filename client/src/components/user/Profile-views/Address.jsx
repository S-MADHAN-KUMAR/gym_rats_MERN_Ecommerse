import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const Address = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [addressData, setAddressData] = useState() // Set to null initially, as no address will be available at the start
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAddress = async () => {
    try {
      const id = currentUser?._id
      if (!id) {
        setError('User ID is missing')
        return
      }
      const res = await axios.get(`http://localhost:3000/user/get_current_address/${id}`)
      if (res.status === 200) {
        setAddressData(res?.data?.address) // Correctly assigning the address data
      }
    } catch (error) {
      console.log(error.message)
      setError('Failed to fetch address') // Displaying error on failure
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddress()
  }, []) 

  return (
    <div className='border h-full p-5'>
      <h1 className='font-audiowide text-3xl uppercase mb-20'>Address settings</h1>
      <div className="flex border p-5 mb-12 justify-around">
      {loading ? (
                            <p>Loading...</p> // Adding a loading state while fetching data
                        ) : error ? (
                            <p>{error}</p> // Display error message if there's an issue fetching data
                        ) : addressData?.addresses?.length > 0 ? ( // Checking if address exists
                            addressData.addresses.map((add) => (
                                <div className="border p-4 font-Robot gap-x-12 w-1/3" key={add._id}>
                                    <h1>Name: {add.name}</h1>
                                    <p>{add.phone}</p>
                                    <p>{add.addressline1}</p>
                                    <p>{add.addressline2}</p>
                                    <p>{add.city}</p>
                                    <p>{add.state}</p>
                                    <p>{add.pincode}</p>
                                    <a href={`/profile/edit_address/${add._id}`} className="btn ms-8">Edit Address +</a>
                                </div>
                            ))
                        ) : (
                            <p>No address available</p> // Handling case when there is no address
                        )}
      </div>
      <a href='/profile/add_address' className='btn'>Add Address +</a>
    </div>
  )
}

export default Address
