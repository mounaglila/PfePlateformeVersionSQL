import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UpdateComponent } from './update/update.component';
import { productsComponent } from './products/products.component';
import { usersComponent } from './users/users.component';
export const routes: Routes = [
  { path: 'products', component: productsComponent },
  { path: 'users', component: usersComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'sidebar', component: SidebarComponent},
  { path: 'update/:table/:id', component: UpdateComponent },
  { path: '', redirectTo: '/admin', pathMatch: 'full' }
];
