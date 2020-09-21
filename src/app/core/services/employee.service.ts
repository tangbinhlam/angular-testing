import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, repeat } from 'rxjs/operators';

import { Employee } from '../../domain/models/employee.model';
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private API_BASE = 'employees/rest/api/v1/';

  constructor(private httpClient: HttpClient) {}

  getEmployees$(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.API_BASE}employees`).pipe(
      map((resp) => resp['data']),
      map((data) => {
        return data.map((employee) => {
          const em: Employee = {
            id: employee.id,
            name: employee.employee_name,
            salary: employee.employee_salary,
            age: employee.employee_age,
          };
          return em;
        });
      }),
    );
  }
}
