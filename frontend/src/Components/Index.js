import axios from 'axios';
import React, { Component, useState, useEffect } from 'react'
import { store } from 'react-notifications-component';
import { connect } from 'react-redux'
import { Card, CardBody, Row, Col, Button } from 'reactstrap'
import NavBar from '../Layouts/NavBar';

import { MDBDataTable } from 'mdbreact'

import { selectNumber } from '../Redux/Housie/Action'

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataArray: this.props.dataArray,
            topLine: [],
            middleLine: [],
            bottomLine: [],
            fullHousie: [],
            isDataReturned: false
        }
    }

    componentWillMount() {
        if (!localStorage.getItem('tokn')) {
            window.location.href = "/login"
        }
    }

    handleButtonClick = (num) => {

        axios.post(`http://localhost:3001/admin/game/appeared/`, {
            gid: this.props.gameData.gameId,
            num: num
        },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("tokn")}`
                }
            }).then(response => {
                if (response.data.statusCode === 404) {
                    store.addNotification({
                        title: "Error",
                        message: "No Game Found",
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
                    this.props.selectNumber(num)
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





    render() {
        return (
            <React.Fragment>
                <NavBar />
                <div className="container-fluid">
                    <div className="my-4">
                        <div className="d-flex justify-content-between">
                            <h5><b>Name:</b> {this.props.gameData.gameName}</h5>
                            <h5><b>Date/Time:</b> {this.props.gameData.gameDateTime}</h5>
                            <h5><b>Users:</b> {this.props.gameData.numUsers}</h5>
                        </div>
                        {this.props.gameData.gameId ?

                            <Row className="my-3">
                                <Col>
                                    <Card className="shadow-sm">
                                        <CardBody>
                                            {
                                                [...Array(99)].map((e, i) => {
                                                    return (
                                                        <Button className={"btn m-1 " + (this.props.dataArray.has(i + 1) ? "btn-success" : "btn-info")} key={i + 1} onClick={() => this.handleButtonClick(i + 1)} style={{ width: "3rem" }}>{i + 1}</Button>
                                                    )
                                                })
                                            }
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card className="shadow-sm">
                                        <CardBody>
                                            {
                                                [...this.props.dataArray].map((item) => {
                                                    return (
                                                        <Button color="info" key={item} className="m-1" style={{ width: "3rem" }}>{item}</Button>
                                                    )
                                                })
                                            }
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>

                            :
                            <Card>
                                <CardBody>
                                    <h4>No Game is Selected Yet</h4>
                                </CardBody>
                            </Card>
                        }

                    </div>
                    <div>
                        {this.props.gameData.gameId ?
                            <Row>
                                <Col md={3}>

                                </Col>
                                <Col md={9}>
                                    <Row className="text-left">
                                        <Col md={6}>
                                            <Card>
                                                <CardBody>
                                                    <ShowTable type={"topLine"} gameId={this.props.gameData.gameId} />
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col md={6}>
                                            <Card>
                                                <CardBody>
                                                    <ShowTable type={"middleLine"} gameId={this.props.gameData.gameId} />
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col md={6}>
                                            <Card>
                                                <CardBody>
                                                    <ShowTable type={"bottomLine"} gameId={this.props.gameData.gameId} />
                                                </CardBody>
                                            </Card>
                                        </Col>
                                        <Col md={6}>
                                            <Card>
                                                <CardBody>
                                                    <ShowTable type={"fullHousie"} gameId={this.props.gameData.gameId} />
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>


                            : <></>}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        dataArray: state.dataArray,
        gameData: state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectNumber: (num) => dispatch(selectNumber(num))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);


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
                    rowItem["playBtn"] = <Button id={i} className="btn btn-info py-0 px-3">Make Winner</Button>

                    rowsData.push(rowItem)
                }
                console.log(rowsData)
                setData({
                    completedUsers: rowsData,
                    isDataReturned: true
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
            <MDBDataTable
                hover
                bordered
                entries={20}
                striped
                paging={false}
                data={{
                    columns: columnData,
                    rows: data.completedUsers
                }}
            />

        </React.Fragment>
    )
}
