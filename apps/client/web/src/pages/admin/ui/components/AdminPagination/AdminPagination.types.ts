export type AdminPaginationProps = {
  page: number;
  perPage: number;
  total: number;
  onPageChange: (page: number) => void;
};
