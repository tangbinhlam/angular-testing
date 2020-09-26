import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { Employee } from 'src/app/domain/models/employee.model';

import { EmployeeListComponent } from './employee-list.component';

const mockEmployees: Employee[] = [
  {
    id: 1,
    salary: 50000,
    name: 'Lam',
    age: 40,
  },
  {
    id: 2,
    salary: 500000,
    name: 'Hoai',
    age: 44,
  },
];

describe('EmployeeListComponent', () => {
  describe('UT', () => {
    let component: EmployeeListComponent;
    let employeeService: EmployeeService;
    let formBuilder: FormBuilder;
    employeeService = {
      getEmployees$: (() => {}) as unknown,
    } as EmployeeService;

    beforeEach(() => {
      formBuilder = new FormBuilder();
      component = new EmployeeListComponent(employeeService, formBuilder);
    });

    it('should be created', () => {
      expect(component).toBeTruthy();
      expect(component.employees$).toBeFalsy();
      expect(component.searchForm).toBeFalsy();
    });

    describe('ngOnInit', () => {
      beforeEach(async(() => {
        spyOn(employeeService, 'getEmployees$').and.returnValue(
          of(mockEmployees),
        );
      }));

      it('should create searchForm correctly', async(() => {
        // When
        component.ngOnInit();
        // Then
        expect(component.searchForm).toBeTruthy();
        expect(component.searchForm.get('searchText')).toBeTruthy();
        expect(component.searchForm.get('searchText').value).toEqual('');
      }));

      it('should call and assign employees correctly', async(() => {
        // When
        component.ngOnInit();
        // Then
        expect(employeeService.getEmployees$).toHaveBeenCalledTimes(1);
        expect(
          component.employees$.subscribe((value) => {
            expect(value).toEqual(mockEmployees);
          }),
        );
      }));

      it('should filter correctly employees when searchText changed', async(() => {
        // Given
        component.ngOnInit();
        // Then
        component.searchName.next('Lam');
        expect(employeeService.getEmployees$).toHaveBeenCalledTimes(1);
        expect(
          component.employees$.subscribe((value) => {
            expect(value).toEqual([
              {
                id: 1,
                salary: 50000,
                name: 'Lam',
                age: 40,
              },
            ]);
          }),
        );
      }));

      describe('should return all employees when searchText is', () => {
        [null, ''].forEach((searchText) => {
          it(searchText ? null : `empty`, () => {
            // Given
            component.ngOnInit();
            // Then
            component.searchName.next(searchText);
            expect(employeeService.getEmployees$).toHaveBeenCalledTimes(1);
            expect(
              component.employees$.subscribe((value) => {
                expect(value).toEqual(mockEmployees);
              }),
            );
          });
        });
      });

      it('trackById should return right id', () => {
        // Gien
        const employee: Employee = {
          id: 10,
          name: 'Hung',
          age: 42,
          salary: 700000,
        };
        // When
        const result = component.trackById(employee);
        // Then
        expect(result).toEqual(10);
      });
    });

    it('onSearch should work correctly', async(() => {
      // Given
      component.ngOnInit();
      component.searchForm.get('searchText').setValue('Hoai');
      // When
      component.onSearch();
      // Then
      component.searchName$.subscribe((searchText) => {
        expect(searchText).toEqual('Hoai');
      });
    }));
  });

  describe('IT', () => {
    let component: EmployeeListComponent;
    let fixture: ComponentFixture<EmployeeListComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [EmployeeListComponent],
        imports: [HttpClientTestingModule, ReactiveFormsModule],
        providers: [EmployeeService],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(EmployeeListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
