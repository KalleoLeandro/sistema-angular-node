import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListaProdutosResponse } from 'src/app/shared/models/Produto';
import { CadastrosService } from 'src/app/shared/services/cadastros.service';
import { ConsultasService } from 'src/app/shared/services/consultas.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { PdfService } from 'src/app/shared/services/pdf.service';


@Component({
  selector: 'app-consulta-produto',
  templateUrl: './consulta-produto.component.html',
  styleUrls: ['./consulta-produto.component.css']
})
export class ConsultaProdutoComponent implements OnInit {

  public token = sessionStorage.getItem('authorization');
  public confirmacao: boolean = true;
  public lista: Array<ListaProdutosResponse> = [];
  public resposta: string = "";
  public productId: number = 0;

  constructor(private loginService: LoginService, private router: Router, private consultaService: ConsultasService, private cadastrosService: CadastrosService, private pdfService: PdfService) {
    if (this.token === null) {
      this.router.navigate(['/']);
    } else {
      this.loginService.validarToken(sessionStorage.getItem('authorization') as string).subscribe({
        next: (res) => {
        },
        error: (err) => {
          console.log(err);
          sessionStorage.removeItem("authorization");
          this.router.navigate(['/']);
        }
      });
    }
  }

  ngOnInit(): void {
    this.consultaService.consultaListaProdutos(this.token as string).subscribe({
      next: (res) => {
        this.lista = res;
        const listaFormatada: Array<ListaProdutosResponse> = this.lista.map(x => {
          const novoObjeto: ListaProdutosResponse = {
            id: x.id,
            nome: x.nome,
            preco_custo: x.preco_custo,
            preco_venda: x.preco_venda,
            quantidade: x.quantidade,
            medida: x.medida,
            categoria: x.categoria
          };
          return novoObjeto;
        });
        this.lista = listaFormatada;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  public formatarValor(valor: number): string {
    return `${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }

  public editarProduto(id: number) {
    this.router.navigate([`./sistema/editarproduto/${id}`]);
  }

  public excluirProduto(id: number) {
    this.confirmacao = true;
    this.productId = id;
    this.resposta = "Tem certeza que deseja excluir esse produto?";
    document.getElementById('botaoModal')?.click();
  }

  public confirmar() {
    this.confirmacao = false;
    this.cadastrosService.excluirProduto(this.productId, this.token as string).subscribe({
      next: (res) => {
        this.resposta = "Produto excluido com sucesso!";
      },
      error: (err) => {
        this.resposta = "Erro ao excluir produto!";
        console.log(err);
      }
    });
  }

  public concluir() {
    window.location.reload();
  }

  public gerarPdf() {    
    this.pdfService.gerarPdfProdutos(this.token || '', this.lista).subscribe({      
      next: (res) => {                
        const blob = new Blob([res], { type: 'application/pdf' });
        const downloadUrl = window.URL.createObjectURL(blob);
        
        // Abrir o PDF em uma nova aba
        window.open(downloadUrl, '_blank');
        
        // Revocar a URL do blob após abrir a aba
        window.URL.revokeObjectURL(downloadUrl);
      },
      error: (err) => {
        console.error('Erro ao gerar PDF:', err);
      }
    });
  }
}
