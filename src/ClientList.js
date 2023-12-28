import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class ClientList extends Component {

    constructor(props) {
        super(props);
        this.state = { clients: [] };
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        this.fetchClients();
    }

    async fetchClients() {
        try {
            const response = await fetch('/clients/all');
            if (!response.ok) {
                throw new Error('Failed to fetch clients');
            }
            const data = await response.json();
            console.log('Fetched clients:', data);

            if (!Array.isArray(data)) {
                console.error('Fetched data is not an array:', data);
            }

            this.setState({ clients: data.clients });
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    }

    async remove(id) {
        try {
            await fetch(`/clients/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            let updatedClients = [...this.state.clients].filter(i => i.id !== id);
            this.setState({ clients: updatedClients });
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    }

    render() {
        const { clients } = this.state;
        console.log('Render clients:', clients);

        const clientList = Array.isArray(clients) && clients.map(client => (
            <tr key={client.id}>
                <td>{client.id}</td>
                <td>{client.clientName}</td>
                <td>{client.phone}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={`/clients/${client.id}`}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(client.id)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        ));

        return (
            <div>
                <AppNavbar />
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/clients/new">Add Client</Button>
                    </div>
                    <h3>Clients</h3>
                    <Table className="mt-4">
                        <thead>
                            <tr>
                                <th width="10%">ID</th>
                                <th width="30%">Client Name</th>
                                <th width="30%">Phone</th>
                                <th width="30%">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default ClientList;
