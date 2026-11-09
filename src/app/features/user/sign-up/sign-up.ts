import { Component, inject } from '@angular/core';
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
import { PessoaService } from '../../../shared/services/pessoa-service';
import { EnderecoService } from '../../../shared/services/endereco-service';
import { CustomerSessionService } from '../../../shared/services/customer-session-service';
import { Pessoa } from '../../../shared/types/pessoa';
import { Endereco } from '../../../shared/types/endereco';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';
import { concatMap, map } from 'rxjs';
import { MessageService } from '../../../shared/services/message-service';

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
  private pessoaService = inject(PessoaService);
  private enderecoService = inject(EnderecoService);
  private customerSession = inject(CustomerSessionService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  formPessoa = new FormGroup({
    nome: new FormControl('', [Validators.required]),
    cpf: new FormControl('', [Validators.required]),
    dataNascimento: new FormControl<Date | null>(null, [Validators.required]),
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
    if (this.formPessoa.invalid || this.formEndereco.invalid) {
      this.formPessoa.markAllAsTouched();
      this.formEndereco.markAllAsTouched();
      return;
    }

    const pessoaValue = this.formPessoa.getRawValue();
    const enderecoValue = this.formEndereco.getRawValue();

    const pessoaData: Pessoa = {
      nome: (pessoaValue.nome ?? '').trim(),
      cpf: this.onlyDigits(pessoaValue.cpf ?? ''),
      dataNascimento: formatDate(pessoaValue.dataNascimento!, 'yyyy-MM-dd', 'pt-BR'),
      sexo: pessoaValue.sexo ?? '',
      email: (pessoaValue.email ?? '').trim(),
      telefone: this.onlyDigits(pessoaValue.telefone ?? ''),
    };

    this.pessoaService
      .createPessoa(pessoaData)
      .pipe(
        concatMap((pessoaResponse) => {
          const enderecoData: Endereco = {
            idPessoa: pessoaResponse.idPessoa,
            cep: this.onlyDigits(enderecoValue.cep ?? ''),
            numero: enderecoValue.numero ?? '',
            complemento: enderecoValue.complemento ?? '',
          };

          return this.enderecoService.createEndereco(enderecoData).pipe(map(() => pessoaResponse));
        }),
      )
      .subscribe({
        next: (pessoa) => {
          this.customerSession.setCustomer(pessoa);
          this.messageService.openMessage('Cadastro realizado com sucesso!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          const message = err?.error?.message ?? err?.error;

          this.messageService.openMessage(
            typeof message === 'string' && message
              ? message
              : 'Não foi possível realizar o cadastro.',
            'Fechar',
            5000,
          );
        },
      });
  }

  private onlyDigits(value: string): string {
    return value.replace(/\D/g, '');
  }
}
