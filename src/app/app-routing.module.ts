import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './dashboard/homepage/homepage.component';
import { RegisterComponent } from './dashboard/register/register.component';
import { ListaComponent } from './members/lista/lista.component';
import { MemberDetailsComponent } from './members/member-details/member-details.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './members/messages/messages.component';

const routes: Routes = [
  /* { path: '', redirectTo: 'home', pathMatch: 'full' }, */
  {path: '', component: HomepageComponent},
  {path: 'members', component: MemberListComponent},
  {path: 'members/:id', component: MemberDetailsComponent},
  {path: 'lists', component: ListaComponent},
  {path: 'messages', component: MessagesComponent},
  {path: '**', component: HomepageComponent, pathMatch: 'full'}


/*   { path: 'home', loadChildren: () => import('./dashboard/homepage/homepage.module').then(m => m.HomepageModule) },
 */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
