import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  constructor(
    private servicioUsuario: UsuarioService,
  ) {}

  ngOnInit(): void {}
  cerrarSesion(): void {
    this.servicioUsuario.limpiarToken();
  }
}
