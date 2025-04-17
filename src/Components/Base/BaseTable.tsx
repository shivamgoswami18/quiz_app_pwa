import React, { Fragment, useEffect, useState } from "react";
import {
  ButtonGroup,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  PaginationItem,
  Row,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  Cell,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { commonLabel, notFound } from "../constants/common";
import { RiSearchLine } from "react-icons/ri";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PaginationComponent from "./PaginationComponent";
interface PurchaseOrderItem {
  id: number;
  product_quantity: number;
  received_quantity: number;
  quantity: number;
  product: {
    id: number;
    product_code: string;
  };
}
interface PanelDataProps {
  id: number;
  po_status: string;
  delivery_date: string;
  createdAt: string;
  store_id: number;
  authUser: {
    id: number;
    name: string;
  };
  indent_draft_id: string;
  indentItem: PurchaseOrderItem[];
  purchaseOrderItem: PurchaseOrderItem[];
}
interface TableContainerProps {
  columns: any[];
  data: any[];
  isGlobalFilter?: boolean;
  isProductsFilter?: boolean;
  isContactsFilter?: boolean;
  isCompaniesFilter?: boolean;
  isNFTRankingFilter?: boolean;
  isTaskListFilter?: boolean;
  tableLoader?: boolean;
  hasManualPagination: boolean;
  customPageSize: number;
  tableClass?: string;
  theadClass?: string;
  trClass?: string;
  thClass?: string;
  shouldLineBreak?: boolean;
  divClass?: string;
  SearchPlaceholder?: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  setDrawerOpen?: (value: boolean, data: PanelDataProps) => void;
  totalRecords: number;
  totalNumberOfRows: number;
  fetchData: (page: number) => void;
  fetchSortingData: (page: number, columnName: string, order: string) => void;
  setCustomPageSize: (size: number) => void;
  onSearch?: (value: string) => void;
  manualPagination?: boolean;
  manualFiltering?: boolean;
}

interface FilterProps {
  column: any;
  table: any;
}

interface DebouncedInputProps {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
  placeholder?: string;
  [key: string]: any;
}

// Column Filter
const Filter: React.FC<FilterProps> = ({ column, table }) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <>
      <DebouncedInput
        type="text"
        value={columnFilterValue ?? ""}
        onChange={(value: string) => column.setFilterValue(value)}
        placeholder={commonLabel.Search}
        className="w-36 border shadow rounded"
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
};

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    e.preventDefault();
  }
};

// Global Filter
const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <input
      {...props}
      value={value}
      id="search-bar-0"
      className="form-control shadow-none search"
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
};

const TableContainer: React.FC<TableContainerProps> = ({
  columns,
  data,
  isGlobalFilter,
  tableLoader,
  hasManualPagination,
  customPageSize,
  theadClass,
  trClass,
  setDrawerOpen,
  thClass,
  shouldLineBreak,
  divClass,
  SearchPlaceholder,
  currentPage,
  setCurrentPage,
  totalPages,
  totalRecords,
  totalNumberOfRows,
  fetchData,
  fetchSortingData,
  setCustomPageSize,
  onSearch,
  manualPagination,
  manualFiltering,
}) => {
  let pageSizesArray = [5, 10, 25, 50, 100];
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(customPageSize);
  const [onValueSearch, setOnValueSearch] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [order, setOrder] = useState<{ [key: string]: string }>({});

  const fuzzyFilter = (
    row: any,
    columnId: string,
    value: string,
    addMeta: any
  ) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({
      itemRank,
    });
    return itemRank.passed;
  };

  const table = useReactTable({
    columns,
    data,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: { pageSize: customPageSize },
    },
  });

  const {
    getHeaderGroups,
    getRowModel,
    getCanPreviousPage,
    getCanNextPage,
    nextPage,
    previousPage,
  } = table;

  useEffect(() => {
    setPageSize(customPageSize);
    setCustomPageSize(customPageSize);
  }, [customPageSize, setPageSize]);

  const handleNextPage = () => {
    fetchData(currentPage + 1);
  };

  const handlePreviousPage = () => {
    fetchData(currentPage - 1);
  };

  const handleSorting = (column: any) => {
    const columnName = column.accessorKey;
    const isSorted = sorting?.find((sort) => sort.id === columnName);
    const newSorting = isSorted
      ? { id: columnName, desc: !isSorted.desc }
      : { id: columnName, desc: false };
    setSorting([newSorting]);
    const order = newSorting.desc ? "desc" : "asc";
    setOrder(() => ({
      [columnName]: order,
    }));
    fetchSortingData(currentPage, columnName, order);
  };
  const renderPaginationItems = (): JSX.Element[] => {
    const totalPages = Math.ceil(totalNumberOfRows / pageSize);
    const items = [];

    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <PaginationItem
          key={number}
          active={number === currentPage}
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage(number);
          }}
        >
          {number}
        </PaginationItem>
      );
    }
    return items;
  };

  const handleValueChange = (newValue: string) => {
    setOnValueSearch(newValue);
    if (typeof onSearch === "function") {
      onSearch(newValue);
    }
  };

  const handlePageSizeChange = (value: number) => {
    const newSize = Number(value);
    setCurrentPage(1);
    setPageSize(newSize);
    setCustomPageSize(newSize);
    table.setPageSize(newSize);
  };

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalRecords);

  const renderSkeleton = () => {
    return Array.from({ length: pageSize }).map((_, rowIndex) => (
      <tr key={`skeleton-row-${rowIndex}`}>
        {columns.map((_, colIndex) => (
          <td key={`skeleton-cell-${rowIndex}-${colIndex}`}>
            <Skeleton height={20} />
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <Fragment>
      {isGlobalFilter && (
        <Row className="mb-1">
          <form>
            <Row className="d-flex gap-2 justify-content-between align-items-center">
              <Col sm={4} className="text-start pagenumber">
                Items per page: &nbsp;
                <ButtonGroup>
                  <UncontrolledDropdown>
                    <DropdownToggle
                      tag="button"
                      className="btn btn-link border px-2 py-1 shadow-none text-dark rounded-0"
                      type="button"
                    >
                      {pageSize} <i className="mdi mdi-chevron-down ms-1"></i>
                    </DropdownToggle>
                    <DropdownMenu>
                      {pageSizesArray.map((size) => (
                        <DropdownItem
                          key={size}
                          onClick={() => handlePageSizeChange(size)}
                        >
                          {size}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </ButtonGroup>
              </Col>

              <Col sm={3}>
                {manualFiltering ? (
                  <div className="search-box me-2 mb-2 d-inline-block col-12 position-relative">
                    <i className="bx bx-search-alt position-absolute top-50 start-0 translate-middle-y ps-3"></i>
                    <DebouncedInput
                      value={onValueSearch ?? ""}
                      onChange={(value) => handleValueChange(value)}
                      placeholder="Search"
                      className="form-control ps-5"
                    />
                  </div>
                ) : (
                  <div className="search-box me-2 mb-2 d-inline-block col-12 position-relative">
                    <i className="bx bx-search-alt position-absolute top-50 start-0 translate-middle-y ps-3"></i>
                    <DebouncedInput
                      value={globalFilter ?? ""}
                      onChange={(value) => setGlobalFilter(value)}
                      placeholder={SearchPlaceholder}
                      className="form-control ps-5"
                    />
                  </div>
                )}
              </Col>
            </Row>
          </form>
        </Row>
      )}

      <div className={`${divClass} overflow-x-auto`}>
        {tableLoader ? (
          <SkeletonTheme>
            <Table hover className="table">
              <thead>
                {getHeaderGroups()?.map((headerGroup) => (
                  <tr className={trClass} key={headerGroup.id}>
                    {headerGroup.headers?.map((header) => (
                      <th
                        key={header.id}
                        className={`${thClass}`}
                        onClick={() => {
                          if (
                            header.column.columnDef.enableSorting ===
                              undefined ||
                            header.column.columnDef.enableSorting === true
                          ) {
                            handleSorting(header.column.columnDef);
                          }
                        }}
                      >
                        <b>
                          {header.isPlaceholder ? null : (
                            <>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {order[header.column.id] === "asc" && " ▲"}
                              {order[header.column.id] === "desc" && " ▼"}
                              {header.column.getCanFilter() && (
                                <div>
                                  <Filter
                                    column={header.column}
                                    table={table}
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </b>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="p-5">
                {Array.from({ length: pageSize }).map(() => {
                  return renderSkeleton();
                })}
              </tbody>
            </Table>
          </SkeletonTheme>
        ) : (
          <Table hover className="table">
            <thead className={`${theadClass} bg-light`}>
              {getHeaderGroups()?.map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers?.map((header) => (
                    <th
                      key={header.id}
                      className={`${thClass}`}
                      onClick={() => {
                        if (
                          header.column.columnDef.enableSorting === undefined ||
                          header.column.columnDef.enableSorting === true
                        ) {
                          handleSorting(header.column.columnDef);
                        }
                      }}
                    >
                      <b>
                        {header.isPlaceholder ? null : (
                          <>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {order[header.column.id] === "ASC" && " ▲"}
                            {order[header.column.id] === "DESC" && " ▼"}
                            {header.column.getCanFilter() && (
                              <div>
                                <Filter column={header.column} table={table} />
                              </div>
                            )}
                          </>
                        )}
                      </b>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                getRowModel()?.rows?.length > 0 ? (
                  getRowModel()?.rows?.map((row, i) => (
                    <tr key={row.id} className={trClass}>
                      {row
                        .getVisibleCells()
                        .map((cell: Cell<any, any>, index: number) => {
                          const cellValue = cell.getValue();
                          return (
                            <td
                              key={cell.id}
                              onClick={() => {
                                if (
                                  !row
                                    .getVisibleCells()
                                    [index].id.includes("action")
                                ) {
                                  setDrawerOpen?.(true, row.original);
                                }
                              }}
                              className={
                                row
                                  .getVisibleCells()
                                  [index].id.includes("action")
                                  ? "disable-action"
                                  : ""
                              }
                            >
                              {cellValue === null || cellValue === "" ? (
                                notFound.nullData
                              ) : (
                                <div
                                  className={
                                    shouldLineBreak === undefined
                                      ? "ellipsis"
                                      : undefined
                                  }
                                >
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan={columns?.length || 5} className="text-center">
                      <div className="py-4 text-center w-full">
                        <div>
                          <RiSearchLine className="fs-2" />
                        </div>
                        <div className="mt-4">
                          <h5>{notFound.dataNotFound}</h5>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              ) : (
                <tr className="text-center">
                  <td colSpan={columns?.length} className="text-center">
                    <div className="py-4 text-center">
                      <div>
                        <span className="fs-1 text-success">
                          <RiSearchLine />
                        </span>
                      </div>
                      <div className="mt-4">
                        <h5>{notFound.dataNotFound}</h5>
                        <p className="text-muted">
                          {notFound.trySearchingWithAnotherKeyword}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </div>

      {hasManualPagination && data?.length !== 0 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          pageSize={pageSize}
          startIndex={startIndex}
          endIndex={endIndex}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
          setCurrentPage={setCurrentPage}
          fetchData={fetchData}
          manualPagination={manualPagination}
          getCanPreviousPage={getCanPreviousPage}
          getCanNextPage={getCanNextPage}
          previousPage={previousPage}
          nextPage={nextPage}
          data={data}
          renderPaginationItems={renderPaginationItems}
        />
      )}
    </Fragment>
  );
};

export default TableContainer;
