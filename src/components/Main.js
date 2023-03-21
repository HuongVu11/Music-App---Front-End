import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home";
import SongIndex from "../pages/SongIndex";
import SongShow from "../pages/SongShow";
import SongCreate from "../pages/SongCreate";
import SongUpdate from "../pages/SongUpdate";
import User from "./User";
import { useContext } from 'react'
import UserContext from '../context/UserContext'

const URL = 'http://localhost:4000'

function Main (props) {

    const {isAuthenticated, isAuth, notAuth} = useContext(UserContext)
    const [song,setSong] = useState([])
    const formData = new FormData()
    const getSong = async () => {
        const response = await fetch(`${URL}/songs`)
        const data = await response.json()
        setSong(data)
    };

    const createSong = async (song) => {
        await fetch(`${URL}/songs`, {
            method: 'post',
            body: song
        })
        getSong()
    }

    const updateSong = async (song, id) =>{
        await fetch(`${URL}/songs/${id}`, {
            method: 'put',
            body: song
        })
        getSong()
    }

    const deleteSong = async (id) => {
        await fetch(`${URL}/songs/${id}`, {
          method: 'delete'
        })
        getSong()
    }
    
    useEffect(() => {
        getSong()
    }, [])

    return (
        <main>
            <Routes>
                <Route path='/' element={
                    <Home />
                }/>
                <Route path='/song' element={
                    <SongIndex 
                        song={song} 
                    />
                }/>
                <Route path='/song/create' element={
                    isAuthenticated ? 
                        <SongCreate 
                            createSong={createSong} 
                            formData = {formData}
                        />
                        :
                        <Navigate to='/user' />
                }/>
                <Route path='/song/:id' element={
                    isAuthenticated ? 
                        <SongShow 
                            song={song}
                            URL = {URL}
                            deleteSong={deleteSong}
                        />
                        :
                        <Navigate to='/user' />
                }/>
                <Route path='/song/:id/update' element={
                    isAuthenticated ? 
                        <SongUpdate
                            song={song} 
                            updateSong={updateSong} 
                            formData={formData}
                        />
                        :
                        <Navigate to='/user' />
                }/>
                <Route path='/user' element={
                    <User 
                        isAuth={isAuth}
                        notAuth={notAuth}
                    />
                }/>
            </Routes> 
        </main>
    )
}

export default Main