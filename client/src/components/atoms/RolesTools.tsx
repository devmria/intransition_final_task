export const getRoleColor = (role: string | undefined) => {
  switch (role) {
    case 'owner': return 'error';
    case 'admin': return 'warning';
    case 'editor': return 'primary';
    default: return 'default';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'success';
    case 'BLOCKED': return 'error';
    case 'DELETED': return 'default';
    default: return 'default';
  }
};