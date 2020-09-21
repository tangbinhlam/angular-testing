import { HttpClient } from '@angular/common/http';
import { async, inject, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { EmployeeService } from './employee.service';
import { Employee } from 'src/app/domain/models/employee.model';

describe('EmployeeService', () => {
  const API_BASE = 'employees/rest/api/v1/';

  let service: EmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(EmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('call getEmployees$ should be successfull', inject(
    [HttpTestingController],
    (httpMock) => {
      // Given
      const givenResult = {
        status: 'success',
        data: [
          {
            id: 1,
            employee_name: 'Tiger Nixon',
            employee_salary: 320800,
            employee_age: 61,
            profile_image: '',
          },
          {
            id: 2,
            employee_name: 'Garrett Winters',
            employee_salary: 170750,
            employee_age: 63,
            profile_image: '',
          },
          {
            id: 3,
            employee_name: 'Ashton Cox',
            employee_salary: 86000,
            employee_age: 66,
            profile_image: '',
          },
        ],
      };

      const expectedResult: Employee[] = [
        { id: 1, name: 'Tiger Nixon', salary: 320800, age: 61 },
        { id: 2, name: 'Garrett Winters', salary: 170750, age: 63 },
        { id: 3, name: 'Ashton Cox', salary: 86000, age: 66 },
      ];

      // When
      service.getEmployees$().subscribe((result: Employee[]) => {
        // Then
        expect(result).toEqual(expectedResult);
      });
      httpMock
        .expectOne({
          method: 'GET',
          url: `${API_BASE}employees`,
        })
        .flush(givenResult);
    },
  ));
});
