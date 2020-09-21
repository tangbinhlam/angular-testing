import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeListComponent } from '../employee-list/employee-list.component';
import { EmployeeEditComponent } from '../employee-edit/employee-edit.component';
import { RouterModule, Routes } from '@angular/router';

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
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class EmployeesModule {}
