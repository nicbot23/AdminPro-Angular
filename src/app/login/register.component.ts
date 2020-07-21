import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare function init_plugins();


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css'],
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor(public _usuarioService: UsuarioService, public router: Router) {}

  camposDatosIguales(campo1: string, campo2: string) {
    return (group: FormGroup) => {
      let pass1 = group.controls[campo1].value;
      let pass2 = group.controls[campo2].value;

      if (pass1 === pass2) {
        return null;
      } else {
        return {
          camposDatosIguales: true,
        };
      }
    };
  }

  ngOnInit() {
    init_plugins();

    this.forma = new FormGroup(
      {
        nombre: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required]),
        password2: new FormControl(null, [Validators.required]),
        condiciones: new FormControl(false),
      },
      { validators: this.camposDatosIguales('password', 'password2') }
    );

    //dummmies info
    /*this.forma.setValue({
      nombre: 'Test',
      email: 'test@test.com',
      password: '123',
      password2: '123',
      condiciones: true
    })*/
  }

  registrarUsuario() {
    if (this.forma.invalid) {
      return;
    }

    if (!this.forma.value.condiciones) {
      //console.log('Debe aceptar los terminos y condiciones ');
      //Swal('Importante','Debe aceptar los terminos y condiciones','warning');
      Swal.fire(
        'Hey user!',
        'Debe aceptar los terminos y condiciones ',
        'warning'
      );
      return;
    }


    console.log('forma:  ', this.forma);
    console.log('forma valida:  ', this.forma.valid);
    console.log('verificar usuario completo desde registrar - register: ', this.forma.value); // verificar el formulario entren los datos

    let usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.email,
      this.forma.value.password
    );

    this._usuarioService.crearUsuario( usuario )
              .subscribe( resp => {
                console.log(resp);
                this.router.navigate(['/login'])
              });
  }
}
