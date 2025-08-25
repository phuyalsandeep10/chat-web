export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Unresolved':
      return 'bg-error text-white';
    case 'Pending':
      return 'bg-warning text-white';
    case 'Resolved':
      return 'bg-success text-white';
  }
};
