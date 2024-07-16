import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProductDetail = () => {
    const navigate = useNavigate()

    const handleBack = () => {
        navigate("/")
    }

  return (
    <div className='product'>
        <div>
            <button onClick={handleBack}>Trở về</button>
        </div>
        <div className='product__container'>

        </div>
    </div>
  )
}

export default ProductDetail