import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../auth/interfaces/user.interface';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: ``
})
export class LayoutPageComponent {
  public sidebarItems = [
    {label:'Listado', icon:'label', url:'./list'},
    {label:'Añadir', icon:'add', url:'./new-hero'},
    {label:'Buscar', icon:'search', url:'./search'}
  ]

  constructor(
    private authService:AuthService,
    private router:Router
  ){}

  //Usuario actual de la sesión
  get user():User|undefined{
    return this.authService.currentUser;
  }

  onLogout():void{
    this.authService.logout();
    this.router.navigate(['/auth/login'])
  }

}
