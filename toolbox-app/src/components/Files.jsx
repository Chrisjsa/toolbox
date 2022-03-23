import  React, {useEffect, useState} from 'react'
import Table from "react-bootstrap/Table"
import Search from "./Search";
import {Card, Col, Container, Row} from "react-bootstrap";

const axios = require('axios')

const data_error = [{
    file: 'None',
    text: 'None',
    number: 'None',
    hex: 'None'
}]


let url = "http://localhost:3000/files/data"

const search = "http://localhost:3000/files/data?fileName="

function Files() {

    const [data, setData] = useState([]);
    const func = async (search) => {
        url = search
       await fetchFiles(url)

    }

    // GET request function to Mock API
    const fetchFiles = async(api) => {
        await axios.get(api)
            .then(res => {
                if (res.data.length !== 0) {
                    setData(res.data)
                } else {
                    setData(data_error)
                }
                if (res.data[0].Error) {
                    setData(data_error)
                }
            })
    }

    // Calling the function on component mount
    useEffect(async () => {
        await fetchFiles(url);
    }, []);

    return (
        <Container>
            <Row className="justify-content-center">
                <Col xs md="12">
                    <Card  style={{ backgroundColor:"indianred" , width:"100%"}}>
                        <Card.Text style={{ color:"white" , fontSize:"18px",  padding:"10px" }}>
                            React test App
                        </Card.Text>

                    </Card>
                </Col>
            </Row>

            <Search   func={func}
                      path ={search}/>
            <Table mt-3 striped  bordered hover size="sm">
                <thead>
                <tr>
                    <th>File Name</th>
                    <th>Text</th>
                    <th>Number</th>
                    <th>Hex</th>
                </tr>
                </thead>
                <tbody>
                {
                    data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.file}</td>
                            <td>{item.text}</td>
                            <td>{item.number}</td>
                            <td>{item.hex}</td>
                        </tr>
                    ))
                }
                </tbody>
            </Table>

        </Container>
    );
}

export default Files