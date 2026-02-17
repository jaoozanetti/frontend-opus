/**
 * @file src/shared/services/index.ts
 */

export {
  createAuditPayload,
  executeWithAudit,
  listAuditLogs,
} from './auditService'

export {
  sanitizeHtml,
  sanitizeText,
  isDangerousContent,
} from './sanitizer'

export {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from './userService'

export {
  listClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
} from './clientService'

export {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from './productService'

export {
  listSales,
  getSale,
  createSale,
  deleteSale,
} from './saleService'
