import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import NewEvent from './NewEvent'
import '@testing-library/jest-dom'

jest.mock('./NewEvent.css', () => ({}))

test('renders the button', () => {
    render(<NewEvent />)
    expect(screen.getByText('Add Event')).toBeInTheDocument()
})

test('opens the form', () => {
    render(<NewEvent />)
    expect(screen.queryByText('New Event')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Add Event/i }))
    expect(screen.getByText('New Event')).toBeInTheDocument()
})

test('closes the form', () => {
    render(<NewEvent />)
    expect(screen.queryByText('New Event')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Add Event/i }))
    expect(screen.getByText('New Event')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /X/i }))
    expect(screen.queryByText('New Event')).not.toBeInTheDocument()
})

test('set name', () => {
    render(<NewEvent />)
    fireEvent.click(screen.getByRole('button', { name: /Add Event/i }))
    const input = screen.getByLabelText('Name:')
    fireEvent.change(input, { target: { value: 'Hello' } })
    expect(input).toHaveValue('Hello')
})

test('set description', () => {
    render(<NewEvent />)
    fireEvent.click(screen.getByRole('button', { name: /Add Event/i }))
    const input = screen.getByLabelText('Description:')
    fireEvent.change(input, { target: { value: 'This is a description' } })
    expect(input).toHaveValue('This is a description')
})

test('set link', () => {
    render(<NewEvent />)
    fireEvent.click(screen.getByRole('button', { name: /Add Event/i }))
    const input = screen.getByLabelText('Link (Optional):')
    fireEvent.change(input, { target: { value: 'google.com' } })
    expect(input).toHaveValue('google.com')
})

test('set start date', () => {
    render(<NewEvent />)
    fireEvent.click(screen.getByRole('button', { name: /Add Event/i }))
    const input = screen.getByLabelText('Event Date:')
    fireEvent.change(input, {
        target: { name: 'startDate', value: '2023-12-01' },
    })
    expect(input).toHaveValue('2023-12-01')
})

test('set end date', () => {
    render(<NewEvent />)
    fireEvent.click(screen.getByRole('button', { name: /Add Event/i }))
    const input = screen.getByLabelText('Event Date:')
    fireEvent.change(input, {
        target: { name: 'endDate', value: '2023-12-01' },
    })
    expect(input).toHaveValue('2023-12-01')
})

test('check/uncheck one day only popup', () => {
    render(<NewEvent />)
    fireEvent.click(screen.getByRole('button', { name: /Add Event/i }))
    const oneDayCheckbox = screen.getByLabelText('One Day Only?')
    fireEvent.click(oneDayCheckbox)
    expect(oneDayCheckbox).toBeChecked()
    fireEvent.click(oneDayCheckbox)
    expect(oneDayCheckbox).not.toBeChecked()
})

test('form submit error 1', () => {
    render(<NewEvent />)
    fireEvent.click(screen.getByRole('button', { name: /Add Event/i }))

    const nameInput = screen.getByLabelText('Name:')
    fireEvent.change(nameInput, { target: { value: 'Hello' } })

    const startInput = screen.getByLabelText('Event Date:')
    fireEvent.change(startInput, {
        target: { name: 'startDate', value: '2024-01-05' },
    })

    const endInput = screen.getByLabelText('Event Date:')
    fireEvent.change(endInput, {
        target: { name: 'endDate', value: '2024-01-04' },
    })

    fireEvent.click(screen.getByText('Submit'))

    expect(screen.getByText('Invalid date range.')).toBeInTheDocument()
})

test('form submit error 2', () => {
    render(<NewEvent />)
    fireEvent.click(screen.getByRole('button', { name: /Add Event/i }))
    fireEvent.click(screen.getByText('Submit'))
    expect(screen.getByText('Please input an event name.')).toBeInTheDocument()
})

test('form submit error 3', () => {
    render(<NewEvent />)
    fireEvent.click(screen.getByRole('button', { name: /Add Event/i }))

    const nameInput = screen.getByLabelText('Name:')
    fireEvent.change(nameInput, { target: { value: 'Hello' } })

    const endInput = screen.getByLabelText('Event Date:')
    fireEvent.change(endInput, {
        target: { name: 'endDate', value: '2024-01-04' },
    })

    fireEvent.click(screen.getByText('Submit'))

    expect(screen.getByText('Please set a start date.')).toBeInTheDocument()
})

test('correct form submission', () => {
    let formData = {}
    const mockUpdate = (data) => {
        formData = data
    }

    render(<NewEvent handleSubmit={mockUpdate} />)

    fireEvent.click(screen.getByRole('button', { name: /Add Event/i }))

    const nameInput = screen.getByLabelText('Name:')
    fireEvent.change(nameInput, { target: { value: 'Hello' } })

    const descInput = screen.getByLabelText('Description:')
    fireEvent.change(descInput, { target: { value: 'This is a description' } })

    const startInput = screen.getByLabelText('Event Date:')
    fireEvent.change(startInput, {
        target: { name: 'startDate', value: '2024-01-01' },
    })

    const endInput = screen.getByLabelText('Event Date:')
    fireEvent.change(endInput, {
        target: { name: 'endDate', value: '2024-01-07' },
    })

    fireEvent.click(screen.getByText('Submit'))

    expect(formData).toHaveProperty('name', 'Hello')
    expect(formData).toHaveProperty('description', 'This is a description')
    expect(formData).toHaveProperty('startDate', '2024-01-01')
    expect(formData).toHaveProperty('endDate', '2024-01-07')
})
