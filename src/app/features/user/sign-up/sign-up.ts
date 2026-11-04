import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CpfMaskDirective } from '../../../shared/directives/cpf-mask';
import { CelularMaskDirective } from '../../../shared/directives/celular-mask';
import { MatCardModule } from '@angular/material/card';
import { CepMask } from '../../../shared/directives/cep-mask';

@Component({
  selector: 'app-sign-up',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSelectModule,
    CpfMaskDirective,
    CelularMaskDirective,
    MatCardModule,
    CepMask,
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  formPessoa = new FormGroup({
    nome: new FormControl('', [Validators.required]),
    cpf: new FormControl('', [Validators.required]),
    dataNascimento: new FormControl('', [Validators.required]),
    sexo: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefone: new FormControl('', [Validators.required]),
  });

  formEndereco = new FormGroup({
    cep: new FormControl('', [Validators.required]),
    numero: new FormControl('', [Validators.required]),
    complemento: new FormControl(''),
  });

  onSubmit() {
    if (this.formPessoa.valid && this.formEndereco.valid) {
      const pessoaData = this.formPessoa.value;
      const enderecoData = this.formEndereco.value;
      console.log('Dados da Pessoa:', pessoaData);
      console.log('Dados do Endereço:', enderecoData);
    }
  }
}
