import React, { Component, useState, useEffect } from 'react'
import { Button, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Nav, Navbar, NavbarBrand, NavItem, NavLink, Row, UncontrolledDropdown } from 'reactstrap'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import {store} from 'react-notifications-component'
import { MDBDataTable } from 'mdbreact'
import ShowAllGames from './NavbarComponents/ShowAllGames.js'
import CreateGameForm from './NavbarComponents/CreateGameForm.js'

export default class NavBar extends Component {
    constructor(props){
        super(props)
        this.state = {
            createGameModal: false,
            allGameModal: false,
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
    toggleAllGameModal = () => {
        this.setState({
            allGameModal: !this.state.allGameModal
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
                        <NavItem>
                            <NavLink className="cursor-pointer" onClick={this.toggleAllGameModal}>Show All Games</NavLink>
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

                <Modal isOpen={this.state.allGameModal} size="lg" backdrop={'static'} toggle={this.toggleAllGameModal}>
                    <ModalHeader toggle={this.toggleAllGameModal}>All Games</ModalHeader>
                    <ModalBody>
                        <ShowAllGames />
                    </ModalBody>
                </Modal>

            </div>
        )
    }
}



