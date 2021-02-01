import React, {useState, useEffect} from 'react'
import { Button, Card, CardBody, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap'
import axios from 'axios'
import NavBar from '../Layouts/NavBar';

export default function Login() {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()

        axios.post(`http://localhost:3001/admin/login`, 
            {
                email: email,
                password: password
            }
        ).then(response => {
            console.log(response)
            if(response.data.statusCode === 404){
                alert("User Not Found")
            }
            if(response.data.statusCode === 403){
                alert("Wrong Password")
            }
            if(response.data.statusCode === 200){
                localStorage.setItem('tokn', response.data.token)
                localStorage.setItem('usr', JSON.stringify(response.data.user))
                window.location.href = "/index"
            }
        })

    }
    useEffect(() => {
        if(localStorage.getItem('tokn')){
            window.location.href = "/index"
        }
    }, [0])
    return (
        <React.Fragment>
            <NavBar />
            <div className="container vh-100 d-flex justify-content-center" style={{flexDirection: "column"}}>
                <Row className="justify-content-center">
                    <Col md={5}>
                        <Card className="shadow-sm text-left">
                            <CardBody>
                                <h2>Login</h2>
                                <p>Welcome to housie game.</p>
                                <Form onSubmit={handleSubmit}>
                                    <FormGroup>
                                        <Label>Email</Label>
                                        <Input type="email" name="email" id="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Password</Label>
                                        <Input type="password" name="password" id="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
                                    </FormGroup>
                                    <Button block color="success">Login</Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

            </div>
        </React.Fragment>
    )
}
