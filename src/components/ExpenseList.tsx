import React, { useState } from 'react'
import { Button, Card, CloseButton, Stack } from 'react-bootstrap';
import { useExpense } from '../context/ExpenseContext';
import { usePageError } from '../hooks/usePageError';
import { Expense } from '../types/Expense';
import { getErrorMessage } from '../utils/getErrorMessage';
import ErrorAlert from './ErrorAlert';
import ExpenseEditForm from './ExpenseEditForm';

type CardProps = {
  expense: Expense;
}

const ExpenseCard: React.FC<CardProps> = ( { expense }) => {
  const { deleteExpense } = useExpense();
  const [error, setError] = usePageError('');
  const [isEdit, setIsEdit] = useState(false);

  const remove = async(expenseId: string) => {
    try {
      await deleteExpense(expenseId);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  }

  return (
    <Card>
      {isEdit ? (
          <>
            <Card.Header className="h5 bg-warning-subtle">Edit expense</Card.Header>
            <Card.Body className="py-4 px-5">
              <ExpenseEditForm defaultExpense={expense} setShow={setIsEdit} />
            </Card.Body>
          </>
        ) : (
          <>
            <Card.Header className="d-flex justify-content-between align-content-center">
              {expense?.spentAt}
              <div className="d-flex gap-3">
                <Button variant="link" className="py-0 text-secondary" onClick={() => setIsEdit(true)}>
                  Edit
                </Button>
                <CloseButton aria-label="Delete expense" onClick={() => remove(expense.id)}/>
              </div>
            </Card.Header>

            <Card.Body>
              <Card.Title>{expense?.title}</Card.Title>
              <Card.Text>{expense?.amount}</Card.Text>
              {expense?.note && (
                <Card.Text>{expense?.note}</Card.Text>
              )}
            </Card.Body>

            <Card.Footer>
              <p className="mb-0 d-inline fw-medium">{'Category: '}</p>
              <p className="mb-0 d-inline">{expense?.category}</p>
            </Card.Footer>

            {!!error && (<ErrorAlert message={error} />)}
                </>
            )}
    </Card>
  )
}

type Props = {
  expenses: Expense[];
}

const ExpenseList: React.FC<Props> = ({ expenses }) => {
  return (
    <Stack gap={3}>
      {expenses.map(expense => (
        <ExpenseCard key={expense.id} expense={expense} />
      ))}
    </Stack>
  )
}

export default ExpenseList
