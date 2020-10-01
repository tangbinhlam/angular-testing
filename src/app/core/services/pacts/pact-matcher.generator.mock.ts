import { integer, somethingLike } from '@pact-foundation/pact/dsl/matchers';
import { Employee } from '../../../domain/models/employee.model';

export function generateEmployeesMatchers(employees: Employee[]): any {
  const result = [];
  employees.forEach((employee) => {
    result.push(generateEmployeeMatcher(employee));
  });
  return result;
}

export function generateEmployeeMatcher(employee: Employee): any {
  return {
    id: integer(employee.id),
    name: somethingLike(employee.name),
    salary: integer(employee.salary),
    age: integer(employee.age),
  };
}
