import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Version100Component } from './version100/version100.component';
import { Version110Component } from './version110/version110.component';
import { Version120Component } from './version120/version120.component';
import { Version130Component } from './version130/version130.component';
import { Version200Component } from './version200/version200.component';
import { AllVersionsComponent } from './all-versions/all-versions.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'all-versions', pathMatch: 'full' },
      { path: 'all-versions', component: AllVersionsComponent },
      { path: '1.0.0', component: Version100Component },
      { path: '1.1.0', component: Version110Component },
      { path: '1.2.0', component: Version120Component },
      { path: '1.3.0', component: Version130Component },
      { path: '2.0.0', component: Version200Component }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VersionsRoutingModule { } 