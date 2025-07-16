'use client'
import { useState, use } from 'react'

export default function blogpage({params} : {
    params : Promise<{
        id : string
    }>
}){
    const { id } = use(params)
    const [likes, setLikes] = useState(0)
    const [isLiked, setIsLiked] = useState(false)
    
    const handleLike = () => {
        setLikes(prev => isLiked ? prev - 1 : prev + 1)
        setIsLiked(!isLiked)
    }
    
    return(
        <div>
            <h1>Blog Post: {id}</h1>
            <p>This content is server-rendered as static HTML first.</p>
            
            {/* This becomes interactive after hydration */}
            <div>
                <button 
                    onClick={handleLike}
                    style={{
                        background: isLiked ? '#ff6b6b' : '#e9ecef',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {isLiked ? '❤️' : '🤍'} {likes} likes
                </button>
            </div>
        </div>
    )
}