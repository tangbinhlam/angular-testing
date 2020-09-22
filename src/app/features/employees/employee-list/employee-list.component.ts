import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  combineAll,
  debounceTime,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { Employee } from 'src/app/domain/models/employee.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees$: Observable<Employee[]>;
  private searchName = new BehaviorSubject('');
  searchName$ = this.searchName.asObservable();
  searchForm: FormGroup;

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
}
