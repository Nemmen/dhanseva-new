import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { EmployeeService } from './employee.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middleware/errorHandler';

const employeeService = new EmployeeService();

export const getAllRequests = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 25, status, assignedDsa, city, paid } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const filters = {
    status: status as string | undefined,
    assignedDsa: assignedDsa as string | undefined,
    city: city as string | undefined,
    paid: paid !== undefined ? paid === 'true' : undefined,
  };

  const { requests, total, analytics } = await employeeService.getAllRequests(skip, take, filters);

  return sendSuccess(res, {
    requests,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
    analytics,
  }, 'All requests retrieved', 200);
});

export const getRequestById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const request = await employeeService.getRequestById(id);
  return sendSuccess(res, request, 'Request details retrieved', 200);
});

export const assignDsa = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { requestId, dsaId } = req.body;

  if (!requestId || !dsaId) {
    throw new AppError('Request ID and DSA ID are required', 400);
  }

  const result = await employeeService.assignDsa(requestId, dsaId, user.id);
  return sendSuccess(res, result, 'DSA assigned successfully', 200);
});

export const inviteDsa = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { email, firstName, lastName, regions, message } = req.body;

  if (!email || !firstName || !lastName || !regions) {
    throw new AppError('Email, name, and regions are required', 400);
  }

  const result = await employeeService.inviteDsa({
    email,
    firstName,
    lastName,
    regions,
    message,
    invitedBy: user.id,
  });

  return sendSuccess(res, result, 'Invite sent successfully', 200);
});

export const updateRequestByEmployee = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const { status, notes, completionNotes } = req.body;

  const updated = await employeeService.updateRequest(id, user.id, { status, notes, completionNotes });
  return sendSuccess(res, updated, 'Request updated successfully', 200);
});

export const getAllDsas = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 25, isActive } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const filters = {
    isActive: isActive !== undefined ? isActive === 'true' : undefined,
  };

  const { dsas, total } = await employeeService.getAllDsas(skip, take, filters);

  return sendSuccess(res, {
    dsas,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  }, 'DSAs retrieved', 200);
});

export const getActiveDsas = asyncHandler(async (_req: Request, res: Response) => {
  const dsas = await employeeService.getActiveDsas();
  return sendSuccess(res, dsas, 'Active DSAs retrieved', 200);
});

export const bulkCreateEmployees = asyncHandler(async (req: Request, res: Response) => {
  const employees = req.body;

  if (!Array.isArray(employees) || employees.length === 0) {
    throw new AppError('Request body must be a non-empty array of employees', 400);
  }

  // Validate each employee object has required fields
  const requiredFields = ['email', 'fullName', 'password'];
  for (const emp of employees) {
    for (const field of requiredFields) {
      if (!emp[field]) {
        throw new AppError(`Missing required field: ${field} for employee ${emp.email || 'unknown'}`, 400);
      }
    }
  }

  const result = await employeeService.bulkCreateEmployees(employees);
  
  return sendSuccess(res, result, 'Employees created successfully', 201);
});
