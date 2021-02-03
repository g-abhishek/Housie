import React, { useState, useEffect } from 'react'
import { Button } from 'reactstrap'
import axios from 'axios'
import { MDBDataTable } from 'mdbreact'
import { connect } from 'react-redux'
import { selectGame } from '../../Redux/Housie/Action'

function ShowAllGames(props){
    const [games, setAllGames] = useState({
        allGames: [],
        isAllGamesReturned: false
    })

    useEffect(() => {
        fetchAllGame()
    }, [0])

    const fetchAllGame = () => {
        axios.get(`http://localhost:3001/admin/game/fetch/all`,{
            headers: {
                'Authorization' : `Bearer ${localStorage.getItem("tokn")}`
            }
        }).then(response => {
            if(response.data.statusCode === 200){
                let rowsData = []
                for (var i = 0; i < response.data.result.length; i++) {
                    let rowItem = response.data.result[i]
                    rowItem["gameDate"] = `${new Date(response.data.result[i].gameDate)}`.substr(0, 25)
                    rowItem["usersCount"] = response.data.result[i].users.length
                    rowItem["playBtn"] = <Button id={i} onClick={() => props.selectGame(JSON.stringify({gameId: rowItem._id, gameName: rowItem.name, gameDateTime: rowItem.gameDate, numUsers: rowItem.usersCount, done: rowItem.done}))} className="btn btn-danger py-0 px-3">Play</Button>

                    rowsData.push(rowItem)
                }
                setAllGames({
                    allGames: rowsData,
                    isAllGamesReturned: true
                })
            }
            
        }).catch(error => {
            console.log(error)
        })
    }
    
    const columnData = [
        {
            label: 'Name',
            field: 'name',
            sort: 'asc',
        },
        {
            label: 'Game Date/Time',
            field: 'gameDate',
            sort: 'asc',
        },
        {
            label: 'Users',
            field: 'usersCount',
            sort: 'asc',
        },
        {
            label: 'Action',
            field: 'playBtn',
            sort: 'asc',
        },
    ]   
        

    return (
        <React.Fragment>
            {games.isAllGamesReturned?
                <MDBDataTable
                    hover
                    bordered
                    entries={20}
                    striped
                    paging={false}
                    data={{
                        columns: columnData,
                        rows: games.allGames
                    }}
                />
            :<></>}
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
        gameData: state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectGame: (data) => dispatch(selectGame(data))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ShowAllGames);