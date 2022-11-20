import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createCustomer, deleteCustomer, getCustomers } from '../api/customer-api'
import Auth from '../auth/Auth'
import { Customer } from '../types/Customer'

interface CustomerProps {
  auth: Auth
  history: History
}

interface CustomerState {
  customers: Customer[]
  newCustomerName: string
  newCustomerAddress: string
  loadingCustomers: boolean
}

export class Customers extends React.PureComponent<CustomerProps, CustomerState> {
  state: CustomerState = {
    customers: [],
    newCustomerName: '',
    newCustomerAddress: '',
    loadingCustomers: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newCustomerName: event.target.value })
  }

  handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newCustomerAddress: event.target.value })
  }

  onEditButtonClick = (customerId: string) => {
    this.props.history.push(`/customers/${customerId}/edit`)
  }

  onCustomerCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newCustomer = await createCustomer(this.props.auth.getIdToken(), {
        name: this.state.newCustomerName,
        address: this.state.newCustomerAddress,
      })
      this.setState({
        customers: [...this.state.customers, newCustomer],
        newCustomerName: ''
      })
    } catch {
      alert('Customer creation failed')
    }
  }

  onCustomerDelete = async (customerId: string) => {
    try {
      await deleteCustomer(this.props.auth.getIdToken(), customerId)
      this.setState({
        customers: this.state.customers.filter(customer => customer.customerId !== customerId)
      })
    } catch {
      alert('Customer deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const customers = await getCustomers(this.props.auth.getIdToken())
      this.setState({
        customers: customers,
        loadingCustomers: false
      })
    } catch (e) {
      alert(`Failed to fetch customers: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Customers</Header>

        {this.renderCreateCustomerInput()}

        {this.renderCustomers()}
      </div>
    )
  }

  renderCreateCustomerInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New customer',
              onClick: this.onCustomerCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Customer name"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Input
            fluid
            actionPosition="left"
            placeholder="Customer address"
            onChange={this.handleAddressChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderCustomers() {
    if (this.state.loadingCustomers) {
      return this.renderLoading()
    }

    return this.renderCustomersList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Customers
        </Loader>
      </Grid.Row>
    )
  }

  renderCustomersList() {
    return (
      <Grid padded>
        {this.state.customers.map((customer, pos) => {
          return (
            <Grid.Row key={customer.customerId}>
              <Grid.Column width={10} verticalAlign="middle">
                {customer.name}
              </Grid.Column>
              <Grid.Column width={3} floated="left">
                {customer.address}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(customer.customerId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onCustomerDelete(customer.customerId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {customer.logo && (
                <Image src={customer.logo} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
