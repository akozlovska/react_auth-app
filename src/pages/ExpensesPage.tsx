import React, { useMemo, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import { ExpenseCategoryFilter, ExpenseFilters } from '../components/ExpenseFilters'
import ExpenseList from '../components/ExpenseList'
import NewExpenseForm from '../components/NewExpenseForm'
import { useExpense } from '../context/ExpenseContext'

const ExpensesPage = () => {
  const [searchParams] = useSearchParams();
  const sortParam = searchParams.get('sort') || 'spentAtDesc';
  const queryParam = searchParams.get('query') || '';
  const filters = searchParams.getAll('filter') || [];

  const [isAdd, setIsAdd] = useState(false);

  const { expenses, filterAndSort } = useExpense();
  const displayedExpenses = useMemo(() => {
    return filterAndSort({
      query: queryParam,
      sort: sortParam,
      filters,
    });
  }, [queryParam, sortParam, filters, expenses]);

  return (
    <div>
      <div className="d-flex gap-5 align-items-center mb-3">
        <h2>Expenses</h2>

        <Button
          variant="success"
          onClick={() => setIsAdd(true)}
        >
          + Add new
        </Button>
      </div>

      <ExpenseFilters />

      <div className="d-flex flex-column-reverse flex-sm-row justify-content-between">
        {expenses.length ? (
          <>
            {((queryParam || filters.length) && !displayedExpenses.length) ? (
              <h3 className="pt-3 flex-grow-1 text-center">No expenses found</h3>
            ) : (
              <ExpenseList expenses={displayedExpenses} />
            )}
            <ExpenseCategoryFilter />
          </>
        ) : (
          <h3 className="pt-3 flex-grow-1 text-center">No expenses yet</h3>
        )}
      </div>

      <NewExpenseForm show={isAdd} setShow={setIsAdd} />
    </div>
  )
}

export default ExpensesPage
