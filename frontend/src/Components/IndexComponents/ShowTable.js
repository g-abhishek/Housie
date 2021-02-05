import axios from 'axios';
import React, { Component, useState, useEffect } from 'react'
import { store } from 'react-notifications-component';
import { connect } from 'react-redux'
import { Card, CardBody, Row, Col, Button, CardHeader } from 'reactstrap'

import { MDBDataTable } from 'mdbreact'

import { annonceWinner } from '../../Redux/Housie/Action'


function ShowTable(props) {

    const [data, setData] = useState({
        completedUsers: [],
        isDataReturned: false
    })

    let type = props.type

    useEffect(() => {
        fetchAllGame()
    }, [0])

    const fetchAllGame = () => {
        
        axios.get(`http://localhost:3001/admin/game/${props.type}/${props.gameId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("tokn")}`
            }
        }).then(response => {
            if (response.data.statusCode === 200) {
                let data = []
                if (type === "topLine") {
                    data = response.data.result.topLine
                }
                else if (type === "middleLine") {
                    data = response.data.result.middleLine
                }
                else if (type === "bottomLine") {
                    data = response.data.result.bottomLine
                }
                else if (type === "fullHousie") {
                    data = response.data.result.fullHousie
                }
                console.log(data)

                let rowsData = []
                for (var i = 0; i < data.length; i++) {
                    let rowItem = data[i]
                    rowItem["playBtn"] = <Button id={i} onClick={() => handleAnnounceWinner({ uid: rowItem._id, mobile: rowItem.mobile, type: type })} className="btn btn-info py-0 px-3">Make Winner</Button>

                    rowsData.push(rowItem)
                }
                setData({
                    completedUsers: rowsData,
                    isDataReturned: true
                })
            }

        }).catch(error => {
            console.log(error)
        })
    }

    const handleAnnounceWinner = (data) => {
        let storeNot =()=> store.addNotification({
            title: "Announced",
            message: "Already Announced",
            type: "info",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 2000,
                onScreen: true
            }
        });
        if(type === "topLine" && props.reduxData.tLWinnerData !== ""){
            storeNot()
            return
        }
        if(type === "middleLine" && props.reduxData.mLWinnerData !== ""){
            storeNot()
            return
        }
        if(type === "bottomLine" && props.reduxData.bLWinnerData !== ""){
            storeNot()
            return
        }
        if(type === "fullHousie" && props.reduxData.fHWinnerData !== ""){
            storeNot()
            return
        }
        let body = {
            gid: props.reduxData.gameId,
            mob: data.mobile
        }
        
        axios.put(`http://localhost:3001/admin/game/winner/${type}`, body,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("tokn")}`
                }
            }).then(response => {
                if (response.data.statusCode === 404) {
                    store.addNotification({
                        title: "Error",
                        message: "Not Found",
                        type: "info",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                            duration: 2000,
                            onScreen: true
                        }
                    });
                }
                if (response.data.statusCode === 200) {
                    store.addNotification({
                        title: "Winner",
                        message: "Winner Announced",
                        type: "success",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                            duration: 2000,
                            onScreen: true
                        }
                    });
                    props.annonceWinner(data)
                }
            }).catch(error => {
                console.log(error)
                store.addNotification({
                    title: "Error",
                    message: "Internal Server Error",
                    type: "danger",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                        duration: 2000,
                        onScreen: true
                    }
                });
            })


    }



    const columnData = [
        {
            label: 'Name',
            field: 'name',
            sort: 'asc',
        },
        {
            label: 'Mobile',
            field: 'mobile',
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
            <Card className="shadow-sm">
                <CardHeader>
                    <h6>{type}</h6>
                </CardHeader>
                <CardBody>
                    {data.isDataReturned?
                    <MDBDataTable
                        hover
                        bordered
                        entries={5}
                        striped
                        paging={false}
                        data={{
                            columns: columnData,
                            rows: data.completedUsers
                        }}
                    />
                    :<></>}
                </CardBody>
            </Card>

        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
        reduxData: state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        annonceWinner: (data) => dispatch(annonceWinner(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowTable);