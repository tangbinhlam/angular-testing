import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeListComponent } from '../employees/employee-list/employee-list.component';
import { EmployeeEditComponent } from '../employees/employee-edit/employee-edit.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: EmployeeListComponent,
    children: [
      {
        path: ':id',
        component: EmployeeEditComponent,
      },
    ],
  },
];
@NgModule({
  declarations: [EmployeeListComponent, EmployeeEditComponent],
  imports: [CommonModule, RouterModule.forChild(routes), ReactiveFormsModule],
})
export class EmployeesModule {}
