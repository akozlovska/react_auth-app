import React, { useCallback, useState } from 'react'
import debounce from 'debounce';
import { CloseButton, Form, InputGroup } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom';
import { getSearchWith, SearchParams } from '../utils/searchHelper';
import { useExpense } from '../context/ExpenseContext';

export const ExpenseFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortParam = searchParams.get('sort') || 'spentAtDesc';
  const queryParam = searchParams.get('query') || '';

  const [query, setQuery] = useState(queryParam);

  const setSearchWith = (params: SearchParams) => {
    const search = getSearchWith(searchParams, params);

    setSearchParams(search);
  };

  const handleSort = (newSortParam: string) => {
    if (sortParam !== newSortParam) {
      setSearchWith({ sort: newSortParam });
    }
  };

  const applyQuery = useCallback(debounce((newQuery: string) => {
    setSearchWith({ query: newQuery || null });
  }, 1000), [searchParams]);

  const handleQuery = (newQuery: string) => {
    setQuery(newQuery);
    applyQuery(newQuery);
  };

  const handleClear = () => {
    setQuery('');
    setSearchWith({ query: null });
  };

  return (
    <div className="mb-3">
      <Form className="d-flex gap-1 gap-md-5 flex-wrap flex-md-nowrap" onSubmit={(e) => e.preventDefault()}>
        <Form.Group className="mb-3" controlId="search">
          <InputGroup>
            <InputGroup.Text>Search</InputGroup.Text>
            <Form.Control
              value={query}
              onChange={e => handleQuery(e.target.value)}
              type="text"
              placeholder="Enter expense info"
            />
            <InputGroup.Text>
            <CloseButton  aria-label="Clear" onClick={handleClear} className="align-self-center"/>
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="sort">
          <InputGroup>
            <InputGroup.Text>Sort by</InputGroup.Text>
            <Form.Select
              value={sortParam}
              onChange={e => handleSort(e.target.value)}
            >
              <option value="spentAtDesc">date (from newest)</option>
              <option value="spentAtAsc">date (from oldest)</option>
              <option value="title">alphabet</option>
              <option value="amountAsc">amount (from lowest)</option>
              <option value="amountDesc">amount (from highest)</option>
            </Form.Select>
          </InputGroup>
        </Form.Group>
      </Form>
    </div>
  )
}

export const ExpenseCategoryFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = searchParams.getAll('filter') || [];
  const { categories } = useExpense();

  const setSearchWith = (params: SearchParams) => {
    const search = getSearchWith(searchParams, params);

    setSearchParams(search);
  };

  const handleFiltersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = filters.includes(e.target.name)
      ? filters.filter(param => param !== e.target.name)
      : [...filters, e.target.name];

    newFilters.length
      ? setSearchWith({ filter: newFilters })
      : setSearchWith({ filter: null });
  }

  return (
    <aside className="d-flex d-sm-block ms-sm-5 pb-3 p-sm-3">
      <h5 className="me-3 flex-shrink-0">Filter by</h5>
      <hr />
      <h6 className="d-none d-sm-block">Categories</h6>
      <Form onSubmit={e => e.preventDefault()} className="overflow-x-scroll overflow-x-sm-auto">
        {categories.map(category => (
          <Form.Check
            key={category.id}
            label={category.name}
            name={category.name}
            type="checkbox"
            id={category.name}
            onChange={handleFiltersChange}
            checked={filters.includes(category.name)}
            className="d-inline-block d-sm-block me-3"
          />
        ))}
      </Form>
    </aside>
  );
}
