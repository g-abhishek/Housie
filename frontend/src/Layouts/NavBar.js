import React, { Component } from 'react'
import { Button, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Nav, Navbar, NavbarBrand, NavItem, NavLink, Row, UncontrolledDropdown } from 'reactstrap'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import {store} from 'react-notifications-component'

export default class NavBar extends Component {
    constructor(props){
        super(props)
        this.state = {
            createGameModal: false
        }
    }

    handleLogout = () => {
        localStorage.removeItem('tokn')
        window.location.href = "/logout"
    }

    toggleCreateGameModal = () => {
        this.setState({
            createGameModal: !this.state.createGameModal
        })
    }


    render() {
        return (
            <div>
                <Navbar color="dark" dark className="border-bottom">
                    <NavbarBrand href="/index">Housie</NavbarBrand>
                    {localStorage.getItem('tokn')?
                    <Nav>
                        <NavItem>
                            <NavLink className="cursor-pointer" onClick={this.toggleCreateGameModal}>Create Game</NavLink>
                        </NavItem>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Profile
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem>
                                    Name: {JSON.parse(localStorage.getItem('usr')).name}
                                </DropdownItem>
                                <DropdownItem>
                                    Email: {JSON.parse(localStorage.getItem('usr')).email}
                                </DropdownItem>
                                <DropdownItem onClick={this.handleLogout}>
                                    Logout
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                    :<></>}
                </Navbar>

                <Modal isOpen={this.state.createGameModal} backdrop={'static'} toggle={this.toggleCreateGameModal}>
                    <ModalHeader toggle={this.toggleCreateGameModal}>Create Game</ModalHeader>
                    <ModalBody>
                        <CreateGameForm toggleCreateGameModal={this.toggleCreateGameModal} />
                    </ModalBody>
                </Modal>

            </div>
        )
    }
}

function CreateGameForm(props){
    const { register, handleSubmit, errors } = useForm()

    const onSubmit = (data) => {
        console.log(data)
        axios.post(`http://localhost:3001/admin/game/create`, data).then(response => {
            console.log(response)
            // alert("Created")
            props.toggleCreateGameModal()
            store.addNotification({
                title: "Created",
                message: "Game Created Successfully",
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
        }).catch(error => {
            console.log(error)
        })
        
    }

    return (
        //required will no work , untill onsubmit line
        <Form onSubmit={handleSubmit(onSubmit)}> 
            <Row>
                <Col>
                    <FormGroup>
                        <Label>Game Name</Label>
                        <input type="text" className="form-control" name="name" id="name" placeholder="Game Name" ref={register({required:true})} autocomplete="off" />
                        {errors.name && <p className="text-danger">Required</p> }
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <FormGroup>
                        <Label>Date</Label>
                        <input type="date" className="form-control" name="date" id="date" placeholder="date" ref={register({required:true})} />
                        {errors.date && <p className="text-danger">Required</p> }
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label>Time</Label>
                        <input type="time" className="form-control" name="time" id="time" placeholder="Game Name" ref={register({required:true})} />
                        {errors.time && <p className="text-danger">Required</p> }
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button block color="success" outline type="submit">Create Game</Button>
                </Col>
            </Row>
        </Form>
    )
}
