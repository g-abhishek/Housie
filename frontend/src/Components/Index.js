import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, CardBody, Row, Col, Button } from 'reactstrap'
import NavBar from '../Layouts/NavBar';

import { selectNumber } from '../Redux/Housie/Action'

class Index extends Component {
    constructor(props){
        super(props)
        this.state = {
            dataArray: this.props.dataArray
        }
    }

    componentWillMount(){
        if(!localStorage.getItem('tokn')){
            window.location.href = "/login"
        }
    }
    // ButtonClick = (val) => {
    //     this.setState({
    //         dataArray: this.state.dataArray.add(val)
    //     })
        
    // }

    render() {
        return (
            <React.Fragment>
            <NavBar />
            <div className="container-fluid">
                <div>
                    <Row className="my-3">
                        <Col>
                            <Card className="shadow-sm">
                                <CardBody>
                                    {
                                        [...Array(99)].map((e, i)=>{
                                            return (
                                                <Button className={"btn m-1 "+(this.props.dataArray.has(i+1) ? "btn-success":"btn-info")} key={i+1} onClick={() => this.props.selectNumber(i+1)} style={{width: "3rem"}}>{i+1}</Button>
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
                                        [...this.props.dataArray].map((item)=>{
                                            return (
                                                <Button color="info" key={item} className="m-1" style={{width: "3rem"}}>{item}</Button>
                                            )
                                        })                                        
                                    }
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    
                </div>
            </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        dataArray: state.dataArray
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectNumber: (num) => dispatch(selectNumber(num))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
