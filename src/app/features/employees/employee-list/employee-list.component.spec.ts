import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import {
  async,
  inject,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { Employee } from 'src/app/domain/models/employee.model';
import { RatePipe } from '../pipes/rate.pipe';

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
        declarations: [EmployeeListComponent, RatePipe],
        imports: [HttpClientTestingModule, ReactiveFormsModule],
        providers: [
          {
            provide: EmployeeService,
            useValue: {
              getEmployees$: () => of(),
            },
          },
        ],
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

    it('should display header correctly', () => {
      // When
      const headerLabel: DebugElement = fixture.debugElement.query(
        By.css('h1'),
      );
      // Then
      expect(headerLabel.nativeElement.textContent.trim()).toEqual(
        'Employee List',
      );
    });

    it('should display search text name correctly', () => {
      // When
      const searchTextLabel: DebugElement = fixture.debugElement.query(
        By.css('div.form-group label'),
      );
      // Then
      expect(searchTextLabel.nativeElement.textContent.trim()).toEqual(
        'Search Name',
      );
    });

    it('should call onSearch when user clicks to Search button', () => {
      // Given
      const button: DebugElement = fixture.debugElement.query(
        By.css('form button'),
      );
      spyOn(component, 'onSearch').and.callFake(() => {});
      // When
      button.nativeElement.click();
      fixture.detectChanges();
      // Then
      expect(component.onSearch).toHaveBeenCalledTimes(1);
      expect(component.onSearch).toHaveBeenCalledWith();
    });

    describe('Render table ', () => {
      it('should not render with empty employee', async(
        inject([EmployeeService], (employeeService) => {
          // Given
          spyOn(employeeService, 'getEmployees$').and.returnValue(of());
          // When
          component.ngOnInit();
          fixture.detectChanges();
          // Then
          const table: DebugElement = fixture.debugElement.query(
            By.css('div table'),
          );
          expect(table).toBeFalsy();
        }),
      ));

      describe('should render', () => {
        beforeEach(async(
          inject([EmployeeService], (employeeService) => {
            // Given
            spyOn(employeeService, 'getEmployees$').and.returnValue(
              of(mockEmployees),
            );
            component.ngOnInit();
            fixture.detectChanges();
          }),
        ));

        it('table', () => {
          const table: DebugElement = fixture.debugElement.query(
            By.css('div table'),
          );
          expect(table).toBeTruthy();
        });

        [
          {
            column: 'Number',
            expectedValue: '#',
          },
          {
            column: 'Name',
            expectedValue: 'Name',
          },
          {
            column: 'Salary',
            expectedValue: 'Salary',
          },
          {
            column: 'Rate',
            expectedValue: 'Rate',
          },
          {
            column: 'Age',
            expectedValue: 'Age',
          },
        ].forEach((testCase: { column: String; expectedValue: String }) => {
          it(`column ${testCase.column} should label with '${testCase.expectedValue}'`, () => {
            // When
            const column: DebugElement = fixture.debugElement.query(
              By.css(`table thead th#header${testCase.column}`),
            );
            // Then
            expect(column.nativeElement.textContent).toEqual(
              testCase.expectedValue,
            );
          });
        });
      });
    });

    it('ngAfterViewInit should trigger event next search name when searchText changed', fakeAsync(() => {
      // Given
      spyOn(component.searchName, 'next').and.callThrough();
      component.searchForm.get('searchText').setValue('Lam Tang');
      // When
      tick(1000);
      fixture.detectChanges();
      // Then
      expect(component.searchName.next).toHaveBeenCalled();
      expect(component.searchName.next).toHaveBeenCalledWith('Lam Tang');
      component.searchName$.subscribe((searchText) => {
        expect(searchText).toEqual('Lam Tang');
      });
    }));
  });
});
