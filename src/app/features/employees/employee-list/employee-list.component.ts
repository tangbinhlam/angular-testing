import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import { debounceTime, map, takeUntil, tap } from 'rxjs/operators';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { Employee } from 'src/app/domain/models/employee.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit, AfterViewInit, OnDestroy {
  employees$: Observable<Employee[]>;
  searchName = new BehaviorSubject('');
  searchName$ = this.searchName.asObservable();
  searchForm: FormGroup;
  unsubscribe$: Subject<void> = new Subject();

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchText: [''],
    });
    this.employees$ = combineLatest(
      this.employeeService.getEmployees$(),
      this.searchName$,
    ).pipe(
      map(([employees, name]) => {
        return employees.filter(
          (employee) => name === '' || employee.name.search(name) !== -1,
        );
      }),
    );
  }

  onSearch() {
    this.searchName.next(this.searchForm.value['searchText']);
  }

  ngAfterViewInit() {
    this.searchForm
      .get('searchText')
      .valueChanges.pipe(debounceTime(1000), takeUntil(this.unsubscribe$))
      .subscribe((value) => this.searchName.next(value));
  }

  trackById(employee: Employee) {
    return employee.id;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
