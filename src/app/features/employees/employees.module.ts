import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeEditComponent } from '../employees/employee-edit/employee-edit.component';
import { EmployeeListComponent } from '../employees/employee-list/employee-list.component';
import { RatePipe } from './pipes/rate.pipe';

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
  declarations: [EmployeeListComponent, EmployeeEditComponent, RatePipe],
  imports: [CommonModule, RouterModule.forChild(routes), ReactiveFormsModule],
})
export class EmployeesModule {}
